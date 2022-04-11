import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { BlobStorageService } from '../../../client/blob-storage/blob-storage.service';
import { CacheClient } from '../../../client/cache/cache-client.interface';
import { AppInsightsLogger } from '../../../util/logging/appi-logger';

import { CSLConfig } from '../csl.config';
import { ContentRow } from '../models/contentMapping.model';

@Injectable()
export class CSLContentService {
  private readonly logger = new AppInsightsLogger(CSLContentService.name);
  private csvHeaders = ['courseID', 'strandID', 'category'];
  constructor(
    private readonly blobService: BlobStorageService,
    private readonly cslConfig: CSLConfig,
    private readonly cache: CacheClient<ContentRow[]>,
  ) {}

  private loadContentCsv = async (): Promise<ContentRow[]> => {
    const cacheKey = `csl:csv:${this.cslConfig.csvFileName}`;
    const cachedContent = await this.cache.getObject(cacheKey);
    if (cachedContent == null) {
      this.logger.debug(
        `Loading csv from blob storage '${this.cslConfig.csvFileName}'`,
      );
      const content = await this.blobService.getFile(
        this.cslConfig.csvFileName,
      );
      this.logger.debug(`Content: ${content}`);

      return new Promise((resolve, reject) => {
        parse(
          content,
          {
            delimiter: ',',
            columns: this.csvHeaders,
            fromLine: 2,
            trim: true,
          },
          (error, result: ContentRow[]) => {
            this.logger.debug('H');
            if (error) {
              this.logger.error(error);
              reject(error);
            }
            this.logger.debug('Caching result');
            this.cache.setObject(cacheKey, result);
            resolve(result);
          },
        );
      });
    } else {
      return cachedContent;
    }
  };

  getCoursesForStrandAndCategory = async (strand: string, category: string) => {
    const contentRows = await this.loadContentCsv();
    return contentRows
      .filter((c) => c.category == category && c.strandID == strand)
      .map((c) => c.courseID);
  };
}
