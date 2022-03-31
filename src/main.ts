import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as appInsights from 'applicationinsights';
import { ConfigService } from '@nestjs/config';
import { AppInsightsLogger } from './util/logging/appi-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const confService = app.get(ConfigService);
  const PORT = confService.get('PORT');
  const logger = await app.resolve(AppInsightsLogger);
  if (confService.get('NODE_ENV') != 'development') {
    appInsights
      .setup()
      .setAutoCollectConsole(true, true)
      .setAutoDependencyCorrelation(true)
      .start();
    logger.setAppInsightsEnabled(true);
  }

  logger.setClient(appInsights.defaultClient);
  app.useLogger(logger);

  await app.listen(PORT);
}

bootstrap();
