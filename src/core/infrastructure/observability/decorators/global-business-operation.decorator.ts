import { Logger } from '@nestjs/common';
import { SpanStatusCode } from '@opentelemetry/api';

export interface BusinessOperationOptions {
  operation?: string;
  module?: string;
  logLevel?: 'log' | 'warn' | 'error' | 'debug';
  skipLogging?: boolean;
  skipMetrics?: boolean;
  skipTracing?: boolean;
}

export function GlobalBusinessOperation(
  operationOrOptions?: string | BusinessOperationOptions,
  module?: string,
  logLevel: 'log' | 'warn' | 'error' | 'debug' = 'debug',
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;
    const logger = new Logger(target.constructor.name);

    // Parse arguments
    let options: BusinessOperationOptions;

    if (typeof operationOrOptions === 'string') {
      options = {
        operation: operationOrOptions,
        module: module || target.constructor.name,
        logLevel,
      };
    } else {
      options = {
        operation: propertyName,
        module: target.constructor.name,
        logLevel: 'debug',
        ...operationOrOptions,
      };
    }

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const correlationId =
        (this as any).generateCorrelationId?.() ||
        `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Extract business context from method context
      const context =
        (this as any).extractBusinessContext?.(args) ||
        (this as any).extractRequestContext?.() ||
        {};

      const { tenantId = 'unknown', userId = 'anonymous' } = context;

      // Create business span if tracing service is available
      let span = null;
      if (
        !options.skipTracing &&
        (this as any).tracingService?.createBusinessSpan
      ) {
        span = (this as any).tracingService.createBusinessSpan(
          options.operation,
          options.module,
          correlationId,
          tenantId,
          userId,
        );
      }

      // Log operation start
      if (
        !options.skipLogging &&
        (this as any).loggingService?.logBusinessOperation
      ) {
        (this as any).loggingService.logBusinessOperation(
          options.operation,
          options.module,
          correlationId,
          tenantId,
          userId,
          undefined,
          {
            phase: 'start',
            args: (this as any).sanitizeArgs?.(args) || 'not-available',
          },
          options.logLevel,
        );
      } else if (!options.skipLogging) {
        // Fallback logging
        logger.debug(
          `[${options.module}] Starting ${options.operation} - Correlation: ${correlationId}`,
        );
      }

      try {
        // Execute the original method
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;

        // Log success
        if (
          !options.skipLogging &&
          (this as any).loggingService?.logBusinessOperation
        ) {
          (this as any).loggingService.logBusinessOperation(
            options.operation,
            options.module,
            correlationId,
            tenantId,
            userId,
            duration,
            {
              phase: 'success',
              result: (this as any).sanitizeResult?.(result) || 'not-available',
            },
            options.logLevel,
          );
        } else if (!options.skipLogging) {
          // Fallback logging
          logger.debug(
            `[${options.module}] Completed ${options.operation} in ${duration}ms - Correlation: ${correlationId}`,
          );
        }

        // Record success metrics
        if (
          !options.skipMetrics &&
          (this as any).metricsService?.recordBusinessOperation
        ) {
          (this as any).metricsService.recordBusinessOperation(
            options.operation,
            options.module,
            duration,
            true,
            tenantId,
            userId,
          );
        }

        // Finalize span with success
        if (span) {
          span.setAttributes({
            'business.duration_ms': duration,
            'business.success': true,
          });
          span.setStatus({ code: SpanStatusCode.OK });
          span.end();
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        // Log error
        if (
          !options.skipLogging &&
          (this as any).loggingService?.logBusinessOperation
        ) {
          (this as any).loggingService.logBusinessOperation(
            options.operation,
            options.module,
            correlationId,
            tenantId,
            userId,
            duration,
            {
              phase: 'error',
              error: error instanceof Error ? error.message : String(error),
              errorType: error.constructor.name,
            },
            'error',
          );
        } else if (!options.skipLogging) {
          // Fallback logging
          logger.error(
            `[${options.module}] Failed ${options.operation} in ${duration}ms - Error: ${error instanceof Error ? error.message : String(error)} - Correlation: ${correlationId}`,
          );
        }

        // Record error metrics
        if (
          !options.skipMetrics &&
          (this as any).metricsService?.recordBusinessOperation
        ) {
          (this as any).metricsService.recordBusinessOperation(
            options.operation,
            options.module,
            duration,
            false,
            tenantId,
            userId,
          );
        }

        // Finalize span with error
        if (span) {
          span.setAttributes({
            'business.duration_ms': duration,
            'business.success': false,
            'error.name': error instanceof Error ? error.name : 'Unknown',
            'error.message':
              error instanceof Error ? error.message : String(error),
          });
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : String(error),
          });
          span.recordException(error);
          span.end();
        }

        // Re-throw the error
        throw error;
      }
    };

    return descriptor;
  };
}

// Helper decorator for database operations
export function GlobalDatabaseOperation(operation?: string, _table?: string) {
  return GlobalBusinessOperation({
    operation: operation || 'db_operation',
    module: 'database',
    logLevel: 'debug',
  });
}

// Helper decorator for external service calls
export function GlobalExternalServiceOperation(
  service: string,
  operation?: string,
) {
  return GlobalBusinessOperation({
    operation: operation || 'external_call',
    module: `external_${service}`,
    logLevel: 'debug',
  });
}

// Helper decorator for critical business operations
export function GlobalCriticalOperation(operation?: string, module?: string) {
  return GlobalBusinessOperation({
    operation,
    module,
    logLevel: 'log',
  });
}
