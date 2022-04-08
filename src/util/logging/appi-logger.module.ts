import { Module } from '@nestjs/common';
import { AppInsightsLogger } from './appi-logger';

@Module({
  providers: [AppInsightsLogger],
  exports: [AppInsightsLogger],
})
export class AppInsightsLoggerModule {}
