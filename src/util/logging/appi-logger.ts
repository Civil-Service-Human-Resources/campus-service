import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { TelemetryClient } from 'applicationinsights';
import {
  SeverityLevel,
  ExceptionTelemetry,
  TraceTelemetry,
} from 'applicationinsights/out/Declarations/Contracts';

@Injectable({ scope: Scope.TRANSIENT })
export class AppInsightsLogger extends ConsoleLogger {
  private client: TelemetryClient;
  private enabled: boolean;

  constructor(name: string) {
    super(name);
  }

  setClient(client: TelemetryClient) {
    this.client = client;
  }

  setAppInsightsEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  error(message: any, trace?: string, context?: string) {
    if (this.enabled) {
      this.client.trackException({
        exception: message as Error,
        severity: SeverityLevel.Error,
        properties: [context, super.context, trace],
      } as ExceptionTelemetry);
      this.client.trackTrace({
        message: message,
        severity: SeverityLevel.Error,
      } as TraceTelemetry);
    }
    super.error(message, trace);
  }

  info = (message: string) => {
    if (this.enabled) {
      this.client.trackTrace({
        message: message,
        severity: SeverityLevel.Information,
        properties: [super.context],
      } as TraceTelemetry);
    }
    super.log(message);
  };

  warn = (message: string) => {
    if (this.enabled) {
      this.client.trackTrace({
        message: message,
        severity: SeverityLevel.Warning,
        properties: [super.context],
      } as TraceTelemetry);
    }
    super.warn(message);
  };

  debug(message: any, context?: string): any {
    if (this.enabled) {
      this.client.trackTrace({
        message: message,
        severity: SeverityLevel.Information,
        properties: [context, super.context],
      } as TraceTelemetry);
    }
    super.debug(message);
  }
}
