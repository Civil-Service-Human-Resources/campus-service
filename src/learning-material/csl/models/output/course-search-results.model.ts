import { Course } from "./course.model";

export interface CourseSearchResults {
  page: number;
  totalResults: number;
  size: number;
  suggestion: string;
  results: Course[];
}
