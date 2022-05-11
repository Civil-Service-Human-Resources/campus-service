import { Injectable, NotFoundException } from '@nestjs/common';
import { AppInsightsLogger } from '../../../util/logging/appi-logger';
import { HttpClientService } from '../http-client/http-client.service';
import { Course } from '../models/output/course.model';
import { GetCourses } from '../models/output/get-courses.model';
import { CSLSearchResult } from '../models/output/search-results.model';

@Injectable()
export class CSLClientService {
  private readonly logger = new AppInsightsLogger(CSLClientService.name);
  constructor(private readonly httpClient: HttpClientService) {}

  async getCoursesWithIds(courseIds: string[]): Promise<Course[]> {
    this.logger.debug(
      `Getting ${courseIds.length} courses from CSL with IDs: ${courseIds}`,
    );
    const totalCourses = [];
    while (courseIds.length) {
      const courseIdSubArr = courseIds.splice(0, 20);
      const resp = await this.httpClient.makeRequest<Course[]>({
        url: `/courses`,
        method: 'GET',
        params: {
          courseId: courseIdSubArr.join(','),
        },
      });
      totalCourses.push(...resp.data);
    }
    return totalCourses;
  }

  async searchForCourses(
    criteria: string,
    page: number,
  ): Promise<CSLSearchResult> {
    this.logger.debug(`Searching CSL with criteria: ${criteria}`);

    const resp = await this.httpClient.makeRequest<CSLSearchResult>({
      url: `/search/courses`,
      params: {
        query: criteria,
        size: 10,
        // CSL pages start at 0, so - 1 from the value passed in
        page: page - 1,
        cost: 0,
      },
      method: 'GET',
    });
    return resp.data;
  }
}
