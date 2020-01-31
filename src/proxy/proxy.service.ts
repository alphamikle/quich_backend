import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosRequestConfig } from 'axios';
import { ProxyEntity } from './entity/proxy.entity';
import { PuppeteerService } from '../puppeteer/puppeteer.service';

@Injectable()
export class ProxyService {
  constructor(
    @InjectRepository(ProxyEntity)
    private readonly proxyEntityRepository: Repository<ProxyEntity>,
    private readonly puppeteerService: PuppeteerService,
  ) {
  }

  private async getLastUsedProxyEntity() {
    const proxy = await this.proxyEntityRepository.findOne({ order: { lastUsedDate: 'ASC' } });
    await this.updateLastUseDate(proxy);
    return proxy;
  }

  private async updateLastUseDate(proxy: ProxyEntity): Promise<void> {
    proxy.lastUsedDate = new Date();
    await this.proxyEntityRepository.save(proxy);
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
    console.log('Created proxy');
    return this.proxyEntityRepository.save(proxy);
  }

  public async request<T>(config: AxiosRequestConfig) {
    const proxy = await this.getLastUsedProxyEntity();
    config.proxy = {
      host: proxy.address,
      port: proxy.port,
      protocol: proxy.protocol,
    };
    try {
      Logger.log(`Proxy ${JSON.stringify(proxy)} will used in request`);
      const response = await axios.request<T>(config);
      await this.incrementCompleteUses(proxy);
      return response;
    } catch (err) {
      Logger.error(err.message);
      await this.incrementNotCompleteUses(proxy);
      throw err;
    }
  }

  public async refreshProxies() {
    const freeProxyList = await this.puppeteerService.getFreeProxyList();
    const proxies: ProxyEntity[] = [];
    await Promise.all(freeProxyList.map(async proxyParam => {
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
    console.log(proxies);
  }
}
