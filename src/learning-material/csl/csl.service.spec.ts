import { Test, TestingModule } from '@nestjs/testing';
import { CslService } from './csl.service';

describe('CslService', () => {
  let service: CslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CslService],
    }).compile();

    service = module.get<CslService>(CslService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
