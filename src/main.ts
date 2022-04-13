import * as appInsights from 'applicationinsights';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { AppInsightsLogger } from './util/logging/appi-logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const confService = app.get(ConfigService);
  const PORT = confService.get('PORT');

  // Logging
  const logger = await app.resolve(AppInsightsLogger);
  if (confService.get('NODE_ENV') != 'development') {
    appInsights
      .setup()
      .setAutoCollectConsole(true, true)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true);
    appInsights.defaultClient.context.tags[
      appInsights.defaultClient.context.keys.cloudRole
    ] = confService.get('APPLICATIONINSIGHTS_ROLE_NAME');
    appInsights.start();
    logger.setAppInsightsEnabled(true);
  }

  logger.setClient(appInsights.defaultClient);
  app.useLogger(logger);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Campus Service')
    .setDescription('Backend service for the Campus website')
    .setVersion('1.0')
    .addTag('campus')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}

bootstrap();
