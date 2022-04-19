import { LearningProvider } from './learning-provider.model';
import { Module } from './module.model';
import { Owner } from './owner.model';

export class Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  learningOutcomes: string;
  modules: Module[];
  learningProvider: LearningProvider;
  audiences: [];
  preparation: string;
  owner: Owner;
  visibility: string;
  status: string;
  topicId: string;
}
