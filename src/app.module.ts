import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { VALIDATION_SCHEMA } from './config/config-validator.schema';
import { CslModule } from './learning-material/csl/csl.module';

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
  ],
})
export class AppModule {}
