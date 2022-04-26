import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CSLContentService } from '../../learning-material/csl/content-mapping/content.service';
import { ParseCategoryPipe } from './parse-category.pipe';

class MockCslContentService {
  async getAllCategories() {
    return ['category_1', 'category_2'];
  }
}

describe('ParseCategoryPipe', () => {
  let moduleRef: TestingModule;
  let categoryPipe: ParseCategoryPipe;

  beforeAll(async () => {
    const CSLContentProvider = {
      provide: CSLContentService,
      useClass: MockCslContentService,
    };

    moduleRef = await Test.createTestingModule({
      providers: [ParseCategoryPipe, CSLContentProvider],
    }).compile();
    categoryPipe = moduleRef.get<ParseCategoryPipe>(ParseCategoryPipe);
  });

  it('Should correctly transform an input category', async () => {
    const res = await categoryPipe.transform('Category_1', null);
    expect(res).toEqual('category_1');
  });

  it('Should correctly transform an input category with a capital', async () => {
    const res = await categoryPipe.transform('Category 2', null);
    expect(res).toEqual('category_2');
  });

  it('Should throw a bad request exception when an invalid category is passed in', async () => {
    await expect(categoryPipe.transform('Category_3', null)).rejects.toEqual(
      new BadRequestException('invalid category supplied'),
    );
  });
});
