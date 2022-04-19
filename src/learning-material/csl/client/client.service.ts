import { Injectable, NotFoundException } from '@nestjs/common';
import { AppInsightsLogger } from '../../../util/logging/appi-logger';
import { HttpClientService } from '../http-client/http-client.service';
import { Course } from '../models/output/course.model';
import { CSLSearchResult } from '../models/output/search-results.model';

@Injectable()
export class CSLClientService {
  private readonly logger = new AppInsightsLogger(CSLClientService.name);
  constructor(private readonly httpClient: HttpClientService) {}

  async getCourseWithId(courseId: string): Promise<Course> {
    this.logger.debug(`Getting course from CSL with ID: ${courseId}`);
    const resp = await this.httpClient.makeRequest<Course>({
      url: `/courses/${courseId}`,
      method: 'GET',
    });
    if (resp.status === 404) {
      throw new NotFoundException(
        `CSL course with ID '${courseId}' does not exist`,
      );
    }
    return resp.data;
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
        page: page,
        cost: 0,
      },
      method: 'GET',
    });
    return resp.data;
  }
}
