import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ProxyEntity } from './entity/proxy.entity';
import { PuppeteerService } from '../puppeteer/puppeteer.service';
import { RequestService } from './dto/requestable.interface';

interface ProxyIdUseDate {
  id: string;
  lastUsedDate: number;
}

@Injectable()
export class ProxyService implements RequestService {
  private proxyUsingQueue: ProxyIdUseDate[] = [];

  constructor(
    @InjectRepository(ProxyEntity)
    private readonly proxyEntityRepository: Repository<ProxyEntity>,
    private readonly puppeteerService: PuppeteerService,
  ) {
    this.cacheUsingDates().then(() =>
      Logger.log(`${ this.proxyUsingQueue.length } proxies are added to queue`),
    );
  }

  public async resetProxies() {
    await this.proxyEntityRepository.clear();
    await this.refreshProxies();
    await this.cacheUsingDates();
    await this.warmProxies(1000, 10);
  }

  public async request<T>(
    config: AxiosRequestConfig,
    { disableProxy = false, isWarming = false, limit = 3, counter = 0 },
  ): Promise<AxiosResponse<T>> {
    config.timeout = 8000;
    if (disableProxy || counter >= limit) {
      return axios.request<T>(config);
    }
    const start = Date.now();
    let proxy: ProxyEntity;
    if (isWarming) {
      proxy = await this.getLastUsedProxyEntity();
    } else {
      proxy = await this.getMostEffectiveProxy();
    }
    if (proxy === null) {
      return this.request<T>(config, {
        isWarming,
        limit,
        counter: counter + 1,
      });
    }
    config.proxy = {
      host: proxy.address,
      port: proxy.port,
      protocol: proxy.protocol,
    };
    try {
      Logger.log(`Proxy ${ JSON.stringify(proxy) } will used in request`);
      const response = await axios.request<T>(config);
      proxy.averageTimeMs = this.compileAvarageTime(proxy, start);
      await this.incrementCompleteUses(proxy);
      return response;
    } catch (err) {
      Logger.error(
        err.message,
        null,
        `${ ProxyService.name }:request={requestConfig:${ JSON.stringify(
          config,
        ) }}`,
      );
      proxy.averageTimeMs = this.compileAvarageTime(proxy, start);
      proxy = this.addErrorToProxy(proxy, err);
      await this.incrementNotCompleteUses(proxy);
      throw err;
    }
  }

  public async refreshProxies() {
    const proxyParams = [];
    proxyParams.push(...(await this.puppeteerService.getFreeProxyList()));
    proxyParams.push(...(await this.puppeteerService.getOpenProxyList()));
    proxyParams.push(...(await this.puppeteerService.getProxyScrapeList()));
    proxyParams.push(...(await this.puppeteerService.getProxyDownloadList()));
    await Promise.all(
      proxyParams.map(async proxyParam => {
        const proxy = new ProxyEntity();
        proxy.address = proxyParam.ip;
        proxy.port = proxyParam.port;
        proxy.protocol = proxyParam.isHttps ? 'https' : 'http';
        if (!(await this.isProxyExist(proxy))) {
          return this.createProxy(proxy);
        }
        return null;
      }),
    );
  }

  public async warmProxies(limit = 1000, iterations = 5) {
    const requests: Array<Array<Promise<AxiosResponse<string>>>> = [];
    while (iterations > 0) {
      const chunk: Array<Promise<AxiosResponse<string>>> = [];
      let i = 0;
      Array(limit)
        .fill('')
        .forEach(() => {
          i += 1;
          const func = async (value: number) => {
            try {
              const response = await this.request<string>(
                {
                  method: 'GET',
                  url: `https://i.picsum.photos/id/${ value }/300/300.jpg`,
                },
                {},
              );
              Logger.log(
                'Warming of proxy complete',
                `${ ProxyService.name }:warmProxies - ${ value }`,
              );
              return response;
            } catch (err) {
              Logger.error(
                err.message,
                null,
                `${ ProxyService.name }:warmProxies - ${ value }`,
              );
              return null;
            }
          };
          chunk.push(func(i));
        });
      requests.push(chunk);
      iterations -= 1;
    }
    let i = 0;
    const allStart = Date.now();
    for await (const chunk of requests) {
      i += 1;
      const start = Date.now();
      await Promise.all(chunk);
      Logger.log(
        `Compete ${ i } chunk of ${ requests.length } in ${ Date.now() - start }ms`,
      );
    }
    Logger.log(`Complete all chunks in ${ Date.now() - allStart }ms`);
  }

  private async cacheUsingDates() {
    this.proxyUsingQueue = [];
    const proxies = await this.proxyEntityRepository.find({
      order: { lastUsedDate: 'DESC' },
    });
    for (const proxy of proxies) {
      this.proxyUsingQueue.push({
        id: proxy.id,
        lastUsedDate: proxy.lastUsedDate.valueOf(),
      });
    }
  }

  private setProxyToTopOfQueue(id: string) {
    const proxyIndex = this.proxyUsingQueue.findIndex(proxy => proxy.id === id);
    const unshift = () => {
      this.proxyUsingQueue.unshift({
        id,
        lastUsedDate: Date.now(),
      });
    };
    if (proxyIndex < 0) {
      unshift();
    } else {
      this.proxyUsingQueue.splice(proxyIndex, 1);
      unshift();
    }
  }

  private async getLastUsedProxyEntity(): Promise<ProxyEntity> {
    const lastUsingProxyId = this.proxyUsingQueue[
      this.proxyUsingQueue.length - 1
    ].id;
    const where: FindConditions<ProxyEntity> = {
      id: lastUsingProxyId,
    };
    this.setProxyToTopOfQueue(lastUsingProxyId);
    const proxy = await this.proxyEntityRepository.findOne({
      where,
      order: { lastUsedDate: 'ASC' },
    });
    await this.updateLastUseDate(proxy);
    return proxy;
  }

  private async getMostEffectiveProxy(): Promise<ProxyEntity> {
    // TODO: Do it in monday
    // const proxy = await this.proxyEntityRepository.findOne({ where:  })
    return null;
  }

  private async updateLastUseDate(proxy: ProxyEntity): Promise<void> {
    proxy.lastUsedDate = new Date();
    await this.proxyEntityRepository.save(proxy);
  }

  private compileAvarageTime(
    proxy: ProxyEntity,
    startTimeStamp: number,
  ): number {
    const overallUses = proxy.completeUses + proxy.notCompleteUses;
    const diff = Date.now() - startTimeStamp;
    const oldAverage = overallUses * proxy.averageTimeMs;
    return Math.trunc((oldAverage + diff) / (overallUses + 1));
  }

  private addErrorToProxy(proxy: ProxyEntity, response: any): ProxyEntity {
    if (proxy.errors === null) {
      proxy.errors = [];
    }
    proxy.errors.push(response);
    return proxy;
  }

  private async incrementCompleteUses(
    proxy: ProxyEntity,
  ): Promise<ProxyEntity> {
    proxy.completeUses += 1;
    return this.proxyEntityRepository.save(proxy);
  }

  private async incrementNotCompleteUses(
    proxy: ProxyEntity,
  ): Promise<ProxyEntity> {
    proxy.notCompleteUses += 1;
    return this.proxyEntityRepository.save(proxy);
  }

  private async isProxyExist(proxy: ProxyEntity): Promise<boolean> {
    return (
      (await this.proxyEntityRepository.count({
        where: { address: proxy.address, port: proxy.port },
      })) > 0
    );
  }

  private async createProxy(proxy: ProxyEntity): Promise<ProxyEntity> {
    return this.proxyEntityRepository.save(proxy);
  }
}
