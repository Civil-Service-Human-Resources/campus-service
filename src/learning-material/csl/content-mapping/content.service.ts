import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/.';
import { BlobStorageService } from 'src/client/blob-storage/blob-storage.service';
import { CSLConfig } from '../csl.config';
import { ContentRow } from '../models/contentMapping.model';
import { CsvCacheService } from './csvCache.service';

@Injectable()
export class CSLContentService {
  constructor(
    private readonly blobService: BlobStorageService,
    private readonly cslConfig: CSLConfig,
    private readonly cache: CsvCacheService,
  ) {}

  private loadContentCsv = async () => {
    const cacheKey = `csl:csv:${this.cslConfig.csvFileName}`;
    const cachedContent = this.cache.getObject(cacheKey);
    if (cachedContent == null) {
      const fileStream = await this.blobService.getFile(
        this.cslConfig.csvFileName,
      );
      const headers = ['courseID', 'strandID', 'category'];
      parse(
        fileStream.read(),
        {
          delimiter: ',',
          columns: headers,
        },
        (error, result: ContentRow[]) => {
          if (error) {
            console.log(error);
          }

          this.cache.setObject(cacheKey, result);
          return result;
        },
      );
    } else {
      return cachedContent;
    }
  };

  getCoursesForStrand = async (strand: string) => {
    const contentRows = this.loadContentCsv();
    return (await contentRows)
      .filter((c) => c.strandId == strand)
      .map((c) => c.CSLId);
  };

  getCoursesForStrandAndCategory = async (strand: string, category: string) => {
    const contentRows = this.loadContentCsv();
    return (await contentRows)
      .filter((c) => c.category == category && c.strandId == strand)
      .map((c) => c.CSLId);
  };
}
