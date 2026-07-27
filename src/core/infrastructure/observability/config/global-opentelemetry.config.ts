import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export interface GlobalTelemetryConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  jaegerEndpoint?: string;
  prometheusPort: number;
  enabled: boolean;
  instrumentations?: {
    http?: boolean;
    nestjs?: boolean;
    redis?: boolean;
    typeorm?: boolean;
    express?: boolean;
  };
}
//TODO: Add instrumentation for all the services
//TODO: Add instrumentation for all the endpoints
//TODO: Add instrumentation for all the databases
//TODO: Add instrumentation for all the caches
//TODO: Add instrumentation for all the queues
//TODO: Add instrumentation for all the services
//TODO: Add instrumentation for all the endpoints
//TODO: Add instrumentation for all the databases

export class GlobalOpenTelemetryConfig {
  private static sdk: NodeSDK | null = null;

  static initialize(config: GlobalTelemetryConfig): void {
    if (!config.enabled) {
      return;
    }

    if (this.sdk) {
      return;
    }

    const resource = resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment,
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]:
        process.env.HOSTNAME || process.env.POD_NAME || 'unknown',
      [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'ddd-bank-account',
      [SemanticResourceAttributes.HOST_NAME]: process.env.HOSTNAME || 'unknown',
      [SemanticResourceAttributes.PROCESS_PID]: process.pid.toString(),
      [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'nodejs',
      [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.version,
    });

    const instrumentations = [];

    // HTTP Instrumentation
    if (config.instrumentations?.http !== false) {
      instrumentations.push(
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-http': {
            enabled: true,
            ignoreIncomingRequestHook: req => {
              const ignoredPaths = ['/health', '/metrics', '/favicon.ico'];
              return ignoredPaths.some(path => req.url?.includes(path));
            },
            ignoreOutgoingRequestHook: req => {
              const url = typeof req === 'string' ? req : req.hostname;
              const ignoredHosts = ['localhost:9090', 'prometheus'];
              return ignoredHosts.some(host => url?.includes(host));
            },
          },
        }),
      );
    }

    // NestJS Instrumentation (if available)
    if (config.instrumentations?.nestjs !== false) {
      try {
        const {
          NestInstrumentation,
        } = require('@opentelemetry/instrumentation-nestjs-core');
        instrumentations.push(new NestInstrumentation());
      } catch {
        console.warn('[OpenTelemetry] NestJS instrumentation not available');
      }
    }

    // Redis Instrumentation
    if (config.instrumentations?.redis !== false) {
      try {
        const {
          IORedisInstrumentation,
        } = require('@opentelemetry/instrumentation-ioredis');
        instrumentations.push(new IORedisInstrumentation());
      } catch {
        console.warn('[OpenTelemetry] Redis instrumentation not available');
      }
    }

    // TypeORM Instrumentation
    if (config.instrumentations?.typeorm !== false) {
      try {
        const {
          TypeormInstrumentation,
        } = require('@opentelemetry/instrumentation-typeorm');
        instrumentations.push(new TypeormInstrumentation());
      } catch {
        console.warn('[OpenTelemetry] TypeORM instrumentation not available');
      }
    }

    // Configure exporters
    const exporters = [];

    // Jaeger Exporter
    if (config.jaegerEndpoint) {
      try {
        exporters.push(
          new JaegerExporter({
            endpoint: config.jaegerEndpoint,
          }),
        );
      } catch (error) {
        console.warn(
          '[OpenTelemetry] Jaeger exporter initialization failed:',
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    // Prometheus Metric Reader
    const metricReaders = [];
    try {
      metricReaders.push(
        new PeriodicExportingMetricReader({
          exporter: new PrometheusExporter({
            port: config.prometheusPort,
            endpoint: '/metrics',
          }) as any,
          exportIntervalMillis: 10000,
        }),
      );
    } catch (error) {
      console.warn(
        '[OpenTelemetry] Prometheus exporter initialization failed:',
        error instanceof Error ? error.message : String(error),
      );
    }

    this.sdk = new NodeSDK({
      resource,
      traceExporter: exporters[0], // Use first available exporter
      metricReader: metricReaders[0], // Use first available reader
      instrumentations: instrumentations.flat(),
    });

    try {
      this.sdk.start();
    } catch (error) {
      console.error('[OpenTelemetry] Failed to initialize SDK:', error);
      this.sdk = null;
    }
  }

  static shutdown(): Promise<void> {
    if (this.sdk) {
      return this.sdk.shutdown();
    }
    return Promise.resolve();
  }

  static isInitialized(): boolean {
    return this.sdk !== null;
  }

  static getDefaultConfig(): GlobalTelemetryConfig {
    return {
      serviceName: process.env.APP_NAME ?? 'ddd-bank-account',
      serviceVersion: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      jaegerEndpoint: process.env.GLOBAL_JAEGER_ENDPOINT,
      prometheusPort: parseInt(process.env.GLOBAL_PROMETHEUS_PORT || '9090'),
      enabled: process.env.ENABLE_GLOBAL_TELEMETRY === 'true',
      instrumentations: {
        http: process.env.GLOBAL_HTTP_INSTRUMENTATION !== 'false',
        nestjs: process.env.GLOBAL_NESTJS_INSTRUMENTATION !== 'false',
        redis: process.env.GLOBAL_REDIS_INSTRUMENTATION !== 'false',
        typeorm: process.env.GLOBAL_TYPEORM_INSTRUMENTATION !== 'false',
        express: process.env.GLOBAL_EXPRESS_INSTRUMENTATION !== 'false',
      },
    };
  }

  static initializeFromEnv(): void {
    const config = this.getDefaultConfig();
    this.initialize(config);
  }
}

// Auto-initialize se as variáveis de ambiente estiverem configuradas
if (process.env.ENABLE_GLOBAL_TELEMETRY === 'true') {
  // Delay initialization to allow app to start
  process.nextTick(() => {
    GlobalOpenTelemetryConfig.initializeFromEnv();
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await GlobalOpenTelemetryConfig.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await GlobalOpenTelemetryConfig.shutdown();
  process.exit(0);
});
