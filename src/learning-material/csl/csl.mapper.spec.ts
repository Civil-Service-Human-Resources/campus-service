import { Test, TestingModule } from '@nestjs/testing';
import { CSLConfig } from './csl.config';
import { CSLCourseMapper } from './csl.mapper';
import { Course } from './models/output/course.model';
import { Module } from './models/output/module.model';

class CSLConfigMock {
  frontendUrl = 'http://test.com';
}

const loadCourse = (): Course => {
  return {
    audiences: [],
    description: 'description',
    id: 'TEST01',
    learningOutcomes: 'learningOutcomes',
    learningProvider: null,
    modules: [],
    owner: null,
    preparation: '',
    shortDescription: 'shortDescription',
    status: '',
    title: 'title',
    topicId: '',
    visibility: '',
  };
};

const loadModule = (duration: number, moduleType: string): Module => {
  return {
    associatedLearning: false,
    cost: 0,
    description: '',
    duration: duration,
    fileSize: 1,
    id: '001',
    mediaId: '',
    moduleType: moduleType,
    optional: false,
    status: '',
    title: '',
    type: '',
    url: '',
  };
};

let sampleCourse: Course;

describe('CSLMapper', () => {
  let moduleRef: TestingModule;
  let mapperUnderTest: CSLCourseMapper;
  beforeAll(async () => {
    const CSLConfigProvider = {
      provide: CSLConfig,
      useClass: CSLConfigMock,
    };
    moduleRef = await Test.createTestingModule({
      providers: [CSLConfigProvider, CSLCourseMapper],
    }).compile();
    mapperUnderTest = moduleRef.get<CSLCourseMapper>(CSLCourseMapper);
  });

  beforeEach(async () => {
    sampleCourse = loadCourse();
  });

  it('Should correctly map a CSL course to a Learning Material object', async () => {
    const resp = await mapperUnderTest.mapCourseToLearningMaterial(
      sampleCourse,
    );
    expect(resp.description[0].content[0]).toEqual('description');
    expect(resp.description[0].label).toEqual('paragraph');
    expect(resp.shortDescription).toEqual('shortDescription');
    expect(resp.id).toEqual('TEST01');
    expect(resp.title).toEqual('title');
    expect(resp.source).toEqual('csl');
    expect(resp.sourceHref).toEqual('http://test.com/courses/TEST01');
  });

  it('should correctly render a carriage-returned bullet list into a list', async () => {
    const course = loadCourse();
    course.description = 'paragraph1:\r\n• bullet1\r\n• bullet2';
    const resp = await mapperUnderTest.mapCourseToLearningMaterial(course);
    const paragraphContent = resp.description;
    expect(paragraphContent[0].label).toEqual('paragraph');
    expect(paragraphContent[0].content[0]).toEqual('paragraph1:');
    expect(paragraphContent[1].label).toEqual('bullets');
    expect(paragraphContent[1].content[0]).toEqual(' bullet1');
    expect(paragraphContent[1].label).toEqual('bullets');
    expect(paragraphContent[1].content[1]).toEqual(' bullet2');
  });

  it('Should correctly render bullet-pointed content into a list', async () => {
    const course = loadCourse();
    course.description =
      'paragraph1\n•\tbullet1\n•\tbullet2\nparagraph2\nparagraph3';
    const resp = await mapperUnderTest.mapCourseToLearningMaterial(course);
    const paragraphContent = resp.description;
    expect(paragraphContent[0].label).toEqual('paragraph');
    expect(paragraphContent[0].content[0]).toEqual('paragraph1');
    expect(paragraphContent[1].label).toEqual('bullets');
    expect(paragraphContent[1].content[0]).toEqual('bullet1');
    expect(paragraphContent[1].label).toEqual('bullets');
    expect(paragraphContent[1].content[1]).toEqual('bullet2');
    expect(paragraphContent[2].label).toEqual('paragraph');
    expect(paragraphContent[2].content[0]).toEqual('paragraph2');
  });

  it('Should correctly calculate the amount of minutes a course takes to complete', async () => {
    const sampleModules: Module[] = [
      loadModule(6000, ''),
      loadModule(3000, ''),
    ];
    sampleCourse.modules = sampleModules;
    const resp = await mapperUnderTest.mapCourseToLearningMaterial(
      sampleCourse,
    );
    expect(resp.duration).toEqual(150);
  });

  it('Should correctly calculate the course type as blended', async () => {
    const sampleModules: Module[] = [
      loadModule(0, 'Video'),
      loadModule(0, 'ELearning'),
    ];
    sampleCourse.modules = sampleModules;
    const resp = await mapperUnderTest.mapCourseToLearningMaterial(
      sampleCourse,
    );
    expect(resp.type).toEqual('Blended');
  });

  it('Should correctly calculate the course type as an individual type', async () => {
    const sampleModules: Module[] = [loadModule(0, 'video')];
    sampleCourse.modules = sampleModules;
    const resp = await mapperUnderTest.mapCourseToLearningMaterial(
      sampleCourse,
    );
    expect(resp.type).toEqual('Video');
  });

  it('Should correctly format the course type as an individual type', async () => {
    const sampleModules: Module[] = [loadModule(0, 'face-to-face')];
    sampleCourse.modules = sampleModules;
    const resp = await mapperUnderTest.mapCourseToLearningMaterial(
      sampleCourse,
    );
    expect(resp.type).toEqual('Face to face');
  });
});
