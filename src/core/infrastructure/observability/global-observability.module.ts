import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  GlobalOpenTelemetryConfig,
  GlobalTelemetryConfig,
} from './config/global-opentelemetry.config';
import { GlobalHealthController } from './controllers/global-health.controller';
import { GlobalObservabilityInterceptor } from './interceptors/global-observability.interceptor';
import { GlobalHealthCheckService } from './services/global-health-check.service';
import { GlobalLoggingService } from './services/global-logging.service';
import { GlobalMetricsService } from './services/global-metrics.service';
import { GlobalTracingService } from './services/global-tracing.service';

@Global()
@Module({
  controllers: [GlobalHealthController],
  providers: [
    GlobalObservabilityInterceptor,
    GlobalMetricsService,
    GlobalTracingService,
    GlobalLoggingService,
    GlobalHealthCheckService,
    {
      provide: 'GLOBAL_TELEMETRY_CONFIG',
      useFactory: (): GlobalTelemetryConfig => {
        const config: GlobalTelemetryConfig = {
          serviceName: process.env.APP_NAME ?? 'ddd-bank-account',
          serviceVersion: process.env.npm_package_version || '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          jaegerEndpoint: process.env.GLOBAL_JAEGER_ENDPOINT,
          prometheusPort: parseInt(
            process.env.GLOBAL_PROMETHEUS_PORT || '9090',
          ),
          enabled: process.env.ENABLE_GLOBAL_TELEMETRY === 'true',
          instrumentations: {
            http: process.env.GLOBAL_HTTP_INSTRUMENTATION !== 'false',
            nestjs: process.env.GLOBAL_NESTJS_INSTRUMENTATION !== 'false',
            redis: process.env.GLOBAL_REDIS_INSTRUMENTATION !== 'false',
            typeorm: process.env.GLOBAL_TYPEORM_INSTRUMENTATION !== 'false',
            express: process.env.GLOBAL_EXPRESS_INSTRUMENTATION !== 'false',
          },
        };

        // Initialize OpenTelemetry with config
        GlobalOpenTelemetryConfig.initialize(config);

        return config;
      },
    },
  ],
  exports: [
    GlobalObservabilityInterceptor,
    GlobalMetricsService,
    GlobalTracingService,
    GlobalLoggingService,
    GlobalHealthCheckService,
    'GLOBAL_TELEMETRY_CONFIG',
  ],
})
export class GlobalObservabilityModule
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    // Record module initialization
    const metricsService = new GlobalMetricsService();
    metricsService.recordSystemMetrics();
  }

  async onModuleDestroy(): Promise<void> {
    console.log('[GlobalObservabilityModule] Shutting down...');
    await GlobalOpenTelemetryConfig.shutdown();
  }
}
