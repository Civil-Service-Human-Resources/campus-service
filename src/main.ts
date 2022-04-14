import * as appInsights from 'applicationinsights';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { AppInsightsLogger } from './util/logging/appi-logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { loadAppInsights } from './appi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const confService = app.get(ConfigService);
  const PORT = confService.get('PORT');

  // Logging
  const logger = await app.resolve(AppInsightsLogger);
  if (confService.get('NODE_ENV') != 'development') {
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

  // CORS
  const campusFe = confService.get('CAMPUS_FRONTEND_URL');
  if (campusFe) {
    app.enableCors({
      origin: campusFe,
    });
  }

  await app.listen(PORT);
}

loadAppInsights();
bootstrap();
