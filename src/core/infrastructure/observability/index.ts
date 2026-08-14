// Global Observability Module Exports

// Main Module
export { GlobalObservabilityModule } from './global-observability.module';

// Services
export { GlobalMetricsService } from './services/global-metrics.service';
export { GlobalTracingService } from './services/global-tracing.service';
export { GlobalLoggingService } from './services/global-logging.service';
export { GlobalHealthCheckService } from './services/global-health-check.service';

// Interceptors
export { GlobalObservabilityInterceptor } from './interceptors/global-observability.interceptor';

// Controllers
export { GlobalHealthController } from './controllers/global-health.controller';

// Decorators
export {
  GlobalBusinessOperation,
  GlobalDatabaseOperation,
  GlobalExternalServiceOperation,
  GlobalCriticalOperation,
} from './decorators/global-business-operation.decorator';

// Configuration
export {
  GlobalOpenTelemetryConfig,
  type GlobalTelemetryConfig,
} from './config/global-opentelemetry.config';

// Types
export * from './types/observability.types';

// Health Check Types
export type {
  SystemComponent,
  SystemComponents,
  SystemMetrics,
  GlobalHealthStatus,
} from './services/global-health-check.service';