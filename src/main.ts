import * as appInsights from 'applicationinsights';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { AppInsightsLogger } from './util/logging/appi-logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { loadAppInsights } from './appi';
import { HttpExceptionFilter } from './util/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const confService = app.get(ConfigService);
  const PORT = confService.get('PORT');

  // Logging
  const logger = await app.resolve(AppInsightsLogger);
  logger.info('Enabling app insights logger ');
  if (confService.get('NODE_ENV') != 'development') {
    logger.setAppInsightsEnabled(true);
  }

  logger.setClient(appInsights.defaultClient);
  app.useLogger(logger);

  // Swagger
  logger.info('Enabling Swagger');
  const config = new DocumentBuilder()
    .setTitle('Campus Service')
    .setDescription('Backend service for the Campus website')
    .setVersion('1.0')
    .addTag('campus')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS
  logger.info('Enabling CORS');
  app.enableCors({
    origin: confService.get<string>('CAMPUS_FRONTEND_URL').split(','),
  });

  // Filters
  logger.info('Adding global filters');
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT);
}

loadAppInsights();
bootstrap();
