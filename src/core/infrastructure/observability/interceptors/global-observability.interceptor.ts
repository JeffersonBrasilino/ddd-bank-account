import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Span, SpanStatusCode } from '@opentelemetry/api';
import { Request, Response } from 'express';
import { Observable, catchError, tap } from 'rxjs';
import { Logger } from '@core/infrastructure/logger';
import { GlobalLoggingService } from '../services/global-logging.service';
import { GlobalMetricsService } from '../services/global-metrics.service';
import { GlobalTracingService } from '../services/global-tracing.service';

@Injectable()
export class GlobalObservabilityInterceptor implements NestInterceptor {
  constructor(
    private readonly metricsService: GlobalMetricsService,
    private readonly tracingService: GlobalTracingService,
    private readonly loggingService: GlobalLoggingService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if it's an HTTP context
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Skip health check and metrics endpoints
    if (this.shouldSkipObservability(request)) {
      return next.handle();
    }

    const correlationId = this.generateCorrelationId();
    const { tenantId, userId } = this.extractRequestContext(request);
    (request as any).correlationId = correlationId;

    return Logger.runInContext(() => {
      Logger.addContextMetadata('correlationId', correlationId);
      if (tenantId) Logger.addContextMetadata('tenantId', tenantId);
      if (userId) Logger.addContextMetadata('userId', userId);

      const span = this.tracingService.createHttpSpan(
        request.method,
        request.url,
        correlationId,
        tenantId,
        userId,
      );

      this.loggingService.logHttpRequest(request, correlationId, tenantId, userId);

      const startTime = Date.now();

      return next.handle().pipe(
        tap(data => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.loggingService.logHttpResponse(
            request,
            response,
            data,
            duration,
            correlationId,
            tenantId,
            userId,
          );

          this.metricsService.recordHttpRequest(
            request.method,
            this.extractRoute(request),
            statusCode,
            duration,
            tenantId,
            userId,
          );

          this.finalizeSpan(span, statusCode, duration, true);
        }),
        catchError(error => {
          const duration = Date.now() - startTime;
          const statusCode = this.extractErrorStatusCode(error);

          this.loggingService.logHttpError(request, error, duration, correlationId, tenantId, userId);

          this.metricsService.recordHttpError(
            request.method,
            this.extractRoute(request),
            statusCode,
            duration,
            error.name || 'UnknownError',
            tenantId,
            userId,
          );

          this.finalizeSpan(span, statusCode, duration, false, error);

          throw error;
        }),
      );
    });
  }

  private shouldSkipObservability(request: Request): boolean {
    const skipPaths = [
      '/health',
      '/metrics',
      '/favicon.ico',
      '/.well-known',
      '/swagger',
      '/docs',
    ];

    return skipPaths.some(path => request.url.includes(path));
  }

  private extractRequestContext(request: Request): {
    tenantId?: string;
    userId?: string;
  } {
    // Extract from different possible sources
    const user = (request as any).user;
    const tenantId =
      (request as any).tenantId ||
      user?.tenantId ||
      request.headers['x-tenant-id'] as string ||
      request.query.tenantId as string;

    const userId =
      user?.id ||
      user?.userId ||
      request.headers['x-user-id'] as string ||
      request.query.userId as string;

    return {
      tenantId: tenantId ? String(tenantId) : undefined,
      userId: userId ? String(userId) : undefined,
    };
  }

  private extractRoute(request: Request): string {
    // Try to get the route pattern from NestJS
    const route = request.route?.path;
    if (route) {
      return route;
    }

    // Fallback to pathname without query parameters
    try {
      const url = new URL(request.url, 'http://localhost');
      return url.pathname;
    } catch {
      return request.url.split('?')[0];
    }
  }

  private extractErrorStatusCode(error: any): number {
    return error.status || error.statusCode || error.code || 500;
  }

  private generateCorrelationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `global_${timestamp}_${random}`;
  }

  private finalizeSpan(
    span: Span,
    statusCode: number,
    duration: number,
    success: boolean,
    error?: Error,
  ): void {
    // Add final attributes to span
    const attributes: Record<string, any> = {
      'http.status_code': statusCode,
      'http.response.duration_ms': duration,
      'http.success': success,
    };

    if (error) {
      attributes['error.name'] = error.name;
      attributes['error.message'] = error.message;

      // Record exception in span
      span.recordException(error);
    }

    span.setAttributes(attributes);

    // Set span status
    if (success) {
      span.setStatus({ code: SpanStatusCode.OK });
    } else {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error?.message || 'HTTP request failed'
      });
    }

    // End the span
    span.end();
  }
}