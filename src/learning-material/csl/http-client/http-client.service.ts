import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { AccessToken } from 'src/client/cache/accessToken/access-token.model';
import { RedisAccessTokenService } from 'src/client/cache/accessToken/redis-access-token-cache.service';
import { AppInsightsLogger } from 'src/util/logging/appi-logger';
import { CSLConfig } from '../csl.config';

@Injectable()
export class HttpClientService {
  private readonly logger = new AppInsightsLogger(HttpClientService.name);
  private readonly httpClient: AxiosInstance = axios.create();
  constructor(
    private readonly config: CSLConfig,
    private readonly tokenStore: RedisAccessTokenService,
  ) {
    this.httpClient.interceptors.request.use(this.requestInterceptor);
    this.httpClient.defaults.baseURL = this.config.baseUrl;
  }

  makeRequest = async <T>(request: AxiosRequestConfig) => {
    try {
      return await this.httpClient.request<T>(request);
    } catch (error) {
      const fullUrl = `${request.baseURL}${request.url}`;
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          this.logger.error(
            `${status} status code encountered when making request with URL: ${fullUrl}, method: ${request.method}. error: ${error}`,
          );
        } else if (error.request) {
          this.logger.error(
            `No response received when making request with URL: ${fullUrl}, method: ${request.method}. error: ${error}`,
          );
        } else {
          this.logger.error(
            `Axios error encountered when making request with URL: ${fullUrl}, method: ${request.method}. error: ${error}`,
          );
        }
      } else {
        this.logger.error(
          `Error encountered when making request with URL: ${fullUrl}, method: ${request.method}. error: ${error}`,
        );
      }
    }
  };

  private requestInterceptor = async (axiosConf: AxiosRequestConfig) => {
    const accessTokenId = this.config.accessTokenId;
    let token = await this.tokenStore.getObject(accessTokenId);
    if (token === null) {
      token = await this.getNewToken();
      console.log(token);
      this.tokenStore.setObject(accessTokenId, token);
    }
    const tokenContent = token.accessToken;
    axiosConf.headers = {
      Authorization: `Bearer ${tokenContent}`,
    };
    return axiosConf;
  };

  private getNewToken = async (): Promise<AccessToken> => {
    this.logger.debug('Fetching new access token');
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    console.log('Sending access token request');
    try {
      this.logger.debug('Attempting access token request');
      const tokenRes = await axios.request({
        url: '/oauth/token',
        baseURL: this.config.identityUrl,
        method: 'post',
        auth: {
          username: this.config.clientId,
          password: this.config.clientSecret,
        },
        data: formData,
        headers: formData.getHeaders(),
      });
      const data = tokenRes.data;
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      throw error;
    }
  };
}
