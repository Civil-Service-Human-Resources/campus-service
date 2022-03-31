import { Test, TestingModule } from '@nestjs/testing';
import { CslController } from '../csl/csl.controller';

describe('CslController', () => {
  let controller: CslController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CslController],
    }).compile();

    controller = module.get<CslController>(CslController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
