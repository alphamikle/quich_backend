import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ProxyEntity } from './entity/proxy.entity';
import { PuppeteerService } from '../puppeteer/puppeteer.service';

interface ProxyIdUseDate {
  id: string;
  lastUsedDate: number;
}

@Injectable()
export class ProxyService {
  constructor(
    @InjectRepository(ProxyEntity)
    private readonly proxyEntityRepository: Repository<ProxyEntity>,
    private readonly puppeteerService: PuppeteerService,
  ) {
    this.cacheUsingDates().then(() => Logger.log(`${ this.proxyUsingQueue.length } proxies are added to queue`));
  }

  private proxyUsingQueue: ProxyIdUseDate[] = [];

  private async cacheUsingDates() {
    this.proxyUsingQueue = [];
    const proxies = await this.proxyEntityRepository.find({ order: { lastUsedDate: 'DESC' } });
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

  private async getLastUsedProxyEntity() {
    const lastUsingProxyId = this.proxyUsingQueue[ this.proxyUsingQueue.length - 1 ].id;
    const where: FindConditions<ProxyEntity> = {
      id: lastUsingProxyId,
    };
    this.setProxyToTopOfQueue(lastUsingProxyId);
    const proxy = await this.proxyEntityRepository.findOne({ where, order: { lastUsedDate: 'ASC' } });
    await this.updateLastUseDate(proxy);
    return proxy;
  }

  private async updateLastUseDate(proxy: ProxyEntity): Promise<void> {
    proxy.lastUsedDate = new Date();
    await this.proxyEntityRepository.save(proxy);
  }

  private compileAvarageTime(proxy: ProxyEntity, startTimeStamp: number): number {
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

  private async incrementCompleteUses(proxy: ProxyEntity): Promise<ProxyEntity> {
    proxy.completeUses += 1;
    return this.proxyEntityRepository.save(proxy);
  }

  private async incrementNotCompleteUses(proxy: ProxyEntity): Promise<ProxyEntity> {
    proxy.notCompleteUses += 1;
    return this.proxyEntityRepository.save(proxy);
  }

  private async isProxyExist(proxy: ProxyEntity): Promise<boolean> {
    return await this.proxyEntityRepository.count({ where: { address: proxy.address, port: proxy.port } }) > 0;
  }

  private async createProxy(proxy: ProxyEntity): Promise<ProxyEntity> {
    return this.proxyEntityRepository.save(proxy);
  }

  public async resetProxies() {
    await this.proxyEntityRepository.clear();
    await this.refreshProxies();
    await this.cacheUsingDates();
    await this.warmProxies(500, 50);
  }

  public async request<T>(config: AxiosRequestConfig, disableProxy = false) {
    config.timeout = 8000;
    if (disableProxy) {
      return axios.request<T>(config);
    }
    const start = Date.now();
    let proxy = await this.getLastUsedProxyEntity();
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
      Logger.error(err.message, null, `${ ProxyService.name }:request={requestConfig:${ JSON.stringify(config) }}`);
      proxy.averageTimeMs = this.compileAvarageTime(proxy, start);
      proxy = this.addErrorToProxy(proxy, err);
      await this.incrementNotCompleteUses(proxy);
      throw err;
    }
  }

  public async refreshProxies() {
    const results = await Promise.all([
      this.puppeteerService.getFreeProxyList(),
      this.puppeteerService.getOpenProxyList(),
      this.puppeteerService.getProxyScrapeList(),
    ]);
    const proxyParams = [];
    for (const result of results) {
      proxyParams.push(...result);
    }
    const proxies: ProxyEntity[] = [];
    await Promise.all(proxyParams.map(async proxyParam => {
      const proxy = new ProxyEntity();
      proxy.address = proxyParam.ip;
      proxy.port = proxyParam.port;
      proxy.protocol = proxyParam.isHttps ? 'https' : 'http';
      proxies.push(proxy);
      if (!await this.isProxyExist(proxy)) {
        return this.createProxy(proxy);
      }
      return null;
    }));
  }

  public async warmProxies(limit = 1000, iterations = 5) {
    const requests: Array<Array<Promise<AxiosResponse<string>>>> = [];
    while(iterations> 0) {
      const chunk: Array<Promise<AxiosResponse<string>>> = [];
      let i = 0;
      Array(limit).fill('').forEach(() => {
        i += 1;
        const func = async (value: number) => {
          try {
            const response = await this.request<string>({
              method: 'GET',
              url: `https://i.picsum.photos/id/${ value }/300/300.jpg`
            });
            Logger.log('Warming of proxy complete', `${ ProxyService.name }:warmProxies - ${ value }`);
            return response;
          } catch (err) {
            Logger.error(err.message, null, `${ ProxyService.name }:warmProxies - ${ value }`);
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
      requests.splice(i - 1, 1);
      Logger.log(`Compete ${ i } chunk of ${ requests.length } in ${ Date.now() - start }ms`);
    }
    Logger.log(`Complete all chunks in ${ Date.now() - allStart }ms`);
  }
}