import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { CslHealth } from '../learning-material/csl/csl.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private cslHealthService: CslHealth,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.cslHealthService.healthCheck()]);
  }
}
