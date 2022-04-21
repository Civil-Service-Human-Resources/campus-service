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
    private readonly catgegoryCache: CacheClient<Array<string>>,
  ) {}

  private loadContentCsv = async (): Promise<ContentRow[]> => {
    this.logger.debug(
      `Loading csv from blob storage '${this.cslConfig.csvFileName}'`,
    );
    const content = await this.blobService.getFile(this.cslConfig.csvFileName);
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
          if (error) {
            this.logger.error(error);
            reject(error);
          }
          resolve(result);
        },
      );
    });
  };

  private fetchContentCsv = async (): Promise<ContentRow[]> => {
    const cacheKey = `csl:csv:${this.cslConfig.csvFileName}`;
    return await this.cache.getObjectWithCallback(
      cacheKey,
      this.loadContentCsv,
    );
  };

  private extractCategoriesFromCsv = async () => {
    const contentRows = await this.fetchContentCsv();
    return Array.from(new Set(contentRows.map((cr) => cr.category)));
  };

  async getAllCategories() {
    const cacheKey = 'csl:categories';
    return await this.catgegoryCache.getObjectWithCallback(
      cacheKey,
      this.extractCategoriesFromCsv,
    );
  }

  getRelevantCategoriesForStrand = async (strand: number) => {
    const contentRows = await this.fetchContentCsv();
    return new Set(
      contentRows.filter((c) => c.strandID == strand).map((c) => c.category),
    );
  };

  getCoursesForStrandAndCategory = async (strand: number, category: string) => {
    const contentRows = await this.fetchContentCsv();
    return contentRows
      .filter((c) => c.category == category && c.strandID == strand)
      .map((c) => c.courseID);
  };
}
