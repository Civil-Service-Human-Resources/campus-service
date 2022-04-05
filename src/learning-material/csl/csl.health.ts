import { Injectable } from '@nestjs/common';
import { HttpHealthIndicator } from '@nestjs/terminus';
import { CSLConfig } from './csl.config';

@Injectable()
export class CslHealth {
  constructor(
    private readonly conf: CSLConfig,
    private http: HttpHealthIndicator,
  ) {}

  healthCheck = async () => {
    return this.http.pingCheck('CSL', `${this.conf.baseUrl}/health`);
  };
}
