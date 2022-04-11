import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { VALIDATION_SCHEMA } from './config/config-validator.schema';
import { CslModule } from './learning-material/csl/csl.module';
import { HealthController } from './health/health.controller';
import { StrandModule } from './strand/strand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: VALIDATION_SCHEMA,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    CslModule,
    TerminusModule,
    StrandModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
