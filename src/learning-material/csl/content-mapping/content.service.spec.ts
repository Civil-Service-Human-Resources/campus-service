import { Test, TestingModule } from '@nestjs/testing';
import { BlobStorageService } from '../../../client/blob-storage/blob-storage.service';
import { CacheClient } from '../../../client/cache/cache-client.interface';

import { CSLConfig } from '../csl.config';
import { ContentRow } from '../models/contentMapping.model';
import { CSLContentService } from './content.service';

const mockCsv = `courseID,strandID,category
  001,1,security
  002,1,analysis
  003,2,security
  004,3,data
  005,4,data
  006,5,security
  007,5,security
  008,5,security
  009,5,security`;

//*TS
class BlobServiceMock {
  getFile(fileName: string) {
    return mockCsv;
  }
}

class CSLConfigMock {
  csvFileName = 'test.csv';
}

class CacheClientMock {
  getObject(cacheKey: string) {
    return null;
  }

  setObject(cacheKey: string, rows: ContentRow[]) {
    return null;
  }
}

describe('CSLContentService', () => {
  let moduleRef: TestingModule;
  let contentService: CSLContentService;

  beforeAll(async () => {
    const BlobServiceProvider = {
      provide: BlobStorageService,
      useClass: BlobServiceMock,
    };
    const CSLConfigProvider = {
      provide: CSLConfig,
      useClass: CSLConfigMock,
    };
    const CacheClientProvider = {
      provide: CacheClient,
      useClass: CacheClientMock,
    };
    moduleRef = await Test.createTestingModule({
      providers: [
        CSLContentService,
        BlobServiceProvider,
        CSLConfigProvider,
        CacheClientProvider,
      ],
    }).compile();

    contentService = moduleRef.get<CSLContentService>(CSLContentService);
  });

  it('should get a course ID for a strand / category combination', async () => {
    const resp = await contentService.getCoursesForStrandAndCategory(
      1,
      'security',
    );
    expect(resp).toEqual(['001']);
  });

  it('should get multiple course IDs for a strand / category combination', async () => {
    const resp = await contentService.getCoursesForStrandAndCategory(
      5,
      'security',
    );
    expect(resp.length).toEqual(4);
  });

  it('should get 0 course IDs for an invalid strand / category combination', async () => {
    const resp = await contentService.getCoursesForStrandAndCategory(
      5,
      'analysis',
    );
    expect(resp.length).toEqual(0);
  });

  it('should return relevant categories based on the strand ID provided', async () => {
    const resp = await contentService.getRelevantCategoriesForStrand(1);
    expect(resp.size).toEqual(2);
    expect(resp[0]).toEqual('security');
    expect(resp[0]).toEqual('analysis');
  });
});
