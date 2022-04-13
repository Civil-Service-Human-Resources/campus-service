import { Injectable, NotFoundException } from '@nestjs/common';
import { AppInsightsLogger } from '../../../util/logging/appi-logger';
import { HttpClientService } from '../http-client/http-client.service';
import { Course } from '../models/output/course.model';

@Injectable()
export class ClientService {
  private readonly logger = new AppInsightsLogger(ClientService.name);
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
}
