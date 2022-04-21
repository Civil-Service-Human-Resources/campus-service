import { Course } from './course.model';

export class CSLSearchResult {
  page: number;
  totalResults: number;
  size: 10;
  suggestion: string;
  results: Course[];
}
