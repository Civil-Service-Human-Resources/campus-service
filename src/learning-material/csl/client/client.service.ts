import { Injectable } from '@nestjs/common';
import { HttpClientService } from '../http-client/http-client.service';
import { Course } from '../models/output/course.model';

@Injectable()
export class ClientService {
  constructor(private readonly httpClient: HttpClientService) {}

  async getCourseWithId(courseId: string): Promise<Course> {
    const resp = await this.httpClient.makeRequest<Course>({
      url: `/courses/${courseId}`,
      method: 'GET',
    });
    return resp.data;
  }
}
