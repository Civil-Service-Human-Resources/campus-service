import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { AccessToken } from '../../../client/cache/accessToken/access-token.model';
import { RedisAccessTokenService } from '../../../client/cache/accessToken/redis-access-token-cache.service';
import { AppInsightsLogger } from '../../../util/logging/appi-logger';
import { CSLConfig } from '../csl.config';

@Injectable()
export class HttpClientService {
  private readonly logger = new AppInsightsLogger(HttpClientService.name);
  private readonly httpClient: AxiosInstance = axios.create({
    baseURL: this.config.baseUrl,
  });
  constructor(
    private readonly config: CSLConfig,
    private readonly tokenStore: RedisAccessTokenService,
  ) {
    this.httpClient.interceptors.request.use(this.requestInterceptor);
  }

  makeRequest = async <T>(request: AxiosRequestConfig) => {
    try {
      return await this.httpClient.request<T>(request);
    } catch (error) {
      // request.baseURL defaults to undefined here for some reason..
      const fullUrl = `${this.config.baseUrl}${request.url}`;
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          error.response.config.baseURL;
          this.logger.error(
            `HTTP error code received when making ${request.method} request to ${fullUrl}. ${error}`,
          );
          if (400 <= status && status <= 499) {
            return error.response;
          } else {
            throw new InternalServerErrorException(error);
          }
        } else if (error.request) {
          this.logger.error(
            `No response received when making ${request.method} request to ${fullUrl}. ${error}`,
          );
        } else {
          this.logger.error(
            `Axios error encountered when making ${request.method} request to ${fullUrl}. ${error}`,
          );
        }
      } else {
        this.logger.error(
          `Error encountered when making ${request.method} request to ${fullUrl}. ${error}`,
        );
      }
      throw error;
    }
  };

  private requestInterceptor = async (axiosConf: AxiosRequestConfig) => {
    const accessTokenId = this.config.accessTokenId;
    const token = await this.tokenStore.getObjectWithCallback(
      accessTokenId,
      async () => await this.getNewToken(),
    );
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
