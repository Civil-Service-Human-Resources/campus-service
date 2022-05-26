import { Test, TestingModule } from '@nestjs/testing';
import { CSLContentService } from '../learning-material/csl/content-mapping/content.service';
import { CslService } from '../learning-material/csl/csl.service';
import { LearningMaterial } from '../learning-material/models/LearningMaterial';
import { StrandService } from './strand.service';

const generateLearningMaterial = (
  title: string,
  id: string,
): LearningMaterial => {
  return {
    description: [],
    duration: 0,
    id: id,
    source: '',
    sourceHref: '',
    title: title,
    type: '',
    shortDescription: '',
  };
};

let courses = [];

class CSLServiceMock {
  getMultipleCourses = () => {
    return courses;
  };
}

class CSLContentServiceMock {
  getCoursesForStrandAndCategory(strandId: number, category: string) {
    return ['001', '002', '003'];
  }
}

describe('StrandService', () => {
  let moduleRef: TestingModule;
  let strandService: StrandService;

  beforeAll(async () => {
    courses = [];
    const CSLServiceProvider = {
      provide: CslService,
      useClass: CSLServiceMock,
    };
    const CSLContentServiceProvider = {
      provide: CSLContentService,
      useClass: CSLContentServiceMock,
    };

    moduleRef = await Test.createTestingModule({
      providers: [StrandService, CSLServiceProvider, CSLContentServiceProvider],
    }).compile();
    strandService = moduleRef.get<StrandService>(StrandService);
  });

  it('Should return the courses in alphabetical order of title', async () => {
    courses = [
      generateLearningMaterial('z', '001'),
      generateLearningMaterial('A', '002'),
      generateLearningMaterial('b', '003'),
    ];
    const res = await strandService.getCoursesForStrandAndCategory(
      1,
      'test',
      1,
    );
    expect(res.totalResults).toEqual(3);
    expect(res.page).toEqual(1);
    expect(res.results[0].id).toEqual('002');
    expect(res.results[1].id).toEqual('003');
    expect(res.results[2].id).toEqual('001');
  });

  it('Should return the courses with correct pagination', async () => {
    courses = [
      generateLearningMaterial('l', '001'),
      generateLearningMaterial('k', '002'),
      generateLearningMaterial('j', '003'),
      generateLearningMaterial('i', '004'),
      generateLearningMaterial('h', '005'),
      generateLearningMaterial('g', '006'),
      generateLearningMaterial('f', '007'),
      generateLearningMaterial('e', '008'),
      generateLearningMaterial('d', '009'),
      generateLearningMaterial('c', '010'),
      generateLearningMaterial('b', '011'),
      generateLearningMaterial('a', '012'),
    ];
    const res = await strandService.getCoursesForStrandAndCategory(
      1,
      'test',
      2,
    );
    expect(res.totalResults).toEqual(12);
    expect(res.page).toEqual(2);
    expect(res.results[0].id).toEqual('002');
    expect(res.results[1].id).toEqual('001');
  });
});
