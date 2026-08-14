import { Injectable } from '@nestjs/common';
import { trace, Span, SpanKind, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class GlobalTracingService {
  private readonly tracer = trace.getTracer('ddd-bank-account', '1.0.0');

  createHttpSpan(
    method: string,
    url: string,
    correlationId: string,
    tenantId?: string,
    userId?: string,
  ): Span {
    const span = this.tracer.startSpan(`http.${method} ${url}`, {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': method,
        'http.url': url,
        'http.route': this.extractRoute(url),
        'correlation.id': correlationId,
        'tenant.id': tenantId || 'unknown',
        'user.id': userId || 'anonymous',
        'service.name': process.env.APP_NAME ?? 'ddd-bank-account',
        'service.version': '1.0.0',
        'service.environment': process.env.NODE_ENV || 'development',
      },
    });

    return span;
  }

  createBusinessSpan(
    operation: string,
    module: string,
    correlationId: string,
    tenantId: string,
    userId: string,
  ): Span {
    const span = this.tracer.startSpan(`business.${module}.${operation}`, {
      kind: SpanKind.INTERNAL,
      attributes: {
        'business.operation': operation,
        'business.module': module,
        'correlation.id': correlationId,
        'tenant.id': tenantId,
        'user.id': userId,
        'service.name': process.env.APP_NAME ?? 'ddd-bank-account',
        'service.version': '1.0.0',
      },
    });

    return span;
  }

  createDatabaseSpan(
    operation: string,
    table: string,
    correlationId: string,
    tenantId?: string,
  ): Span {
    const span = this.tracer.startSpan(`db.${operation}`, {
      kind: SpanKind.CLIENT,
      attributes: {
        'db.operation': operation,
        'db.table': table,
        'db.system': 'postgresql',
        'correlation.id': correlationId,
        'tenant.id': tenantId || 'unknown',
        'service.name': process.env.APP_NAME ?? 'ddd-bank-account',
      },
    });

    return span;
  }

  createExternalServiceSpan(
    service: string,
    operation: string,
    correlationId: string,
    tenantId?: string,
  ): Span {
    const span = this.tracer.startSpan(`external.${service}.${operation}`, {
      kind: SpanKind.CLIENT,
      attributes: {
        'external.service': service,
        'external.operation': operation,
        'correlation.id': correlationId,
        'tenant.id': tenantId || 'unknown',
        'service.name': process.env.APP_NAME ?? 'ddd-bank-account',
      },
    });

    return span;
  }

  addSpanAttributes(span: Span, attributes: Record<string, any>): void {
    span.setAttributes(attributes);
  }

  addSpanEvent(span: Span, name: string, attributes?: Record<string, any>): void {
    span.addEvent(name, attributes);
  }

  recordSpanException(span: Span, error: Error): void {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
  }

  finishSpan(span: Span, success = true, attributes?: Record<string, any>): void {
    if (attributes) {
      span.setAttributes(attributes);
    }

    span.setStatus({
      code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR,
    });

    span.end();
  }

  getCurrentTraceContext(): any {
    const activeSpan = trace.getActiveSpan();
    if (!activeSpan) {
      return null;
    }

    const spanContext = activeSpan.spanContext();
    return {
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
      traceFlags: spanContext.traceFlags,
      isActive: true,
    };
  }

  private extractRoute(url: string): string {
    try {
      const urlObj = new URL(url, 'http://localhost');
      return urlObj.pathname;
    } catch {
      return url.split('?')[0];
    }
  }
}