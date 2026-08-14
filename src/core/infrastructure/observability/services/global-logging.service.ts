import { Injectable } from '@nestjs/common';
import { Logger } from '@core/infrastructure/logger';
import { Request, Response } from 'express';

@Injectable()
export class GlobalLoggingService {
  private readonly logger = Logger.getLogger(GlobalLoggingService.name);

  logHttpRequest(
    request: Request,
    correlationId: string,
    tenantId?: string,
    userId?: string,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      type: 'http_request',
      correlationId,
      method: request.method,
      url: request.url,
      route: request.route?.path || request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip || request.connection?.remoteAddress,
      tenantId: tenantId || 'unknown',
      userId: userId || 'anonymous',
      headers: this.sanitizeHeaders(request.headers),
      query: request.query,
      body: this.sanitizeBody(request.body),
      requestId: (request as any).id,
    };

    this.logger.info(JSON.stringify(logEntry));
  }

  logHttpResponse(
    request: Request,
    response: Response,
    data: any,
    duration: number,
    correlationId: string,
    tenantId?: string,
    userId?: string,
  ): void {
    const responseSize = this.calculateResponseSize(data);

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      type: 'http_response',
      correlationId,
      method: request.method,
      url: request.url,
      route: request.route?.path || request.url,
      statusCode: response.statusCode,
      duration,
      tenantId: tenantId || 'unknown',
      userId: userId || 'anonymous',
      responseSize,
      requestId: (request as any).id,
    };

    this.logger.info(JSON.stringify(logEntry));
  }

  logHttpError(
    request: Request,
    error: Error,
    duration: number,
    correlationId: string,
    tenantId?: string,
    userId?: string,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      type: 'http_error',
      correlationId,
      method: request.method,
      url: request.url,
      route: request.route?.path || request.url,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
        status: (error as any).status,
      },
      duration,
      tenantId: tenantId || 'unknown',
      userId: userId || 'anonymous',
      requestId: (request as any).id,
    };

    this.logger.error(JSON.stringify(logEntry));
  }

  logBusinessOperation(
    operation: string,
    module: string,
    correlationId: string,
    tenantId: string,
    userId: string,
    duration?: number,
    metadata?: Record<string, any>,
    level: 'log' | 'warn' | 'error' | 'debug' = 'log',
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level === 'log' ? 'info' : level,
      type: 'business_operation',
      correlationId,
      operation,
      module,
      tenantId,
      userId,
      duration,
      metadata: this.sanitizeMetadata(metadata),
      environment: process.env.NODE_ENV || 'development',
    };

    switch (level) {
      case 'error':
        this.logger.error(JSON.stringify(logEntry));
        break;
      case 'warn':
        this.logger.warn(JSON.stringify(logEntry));
        break;
      case 'debug':
        this.logger.debug(JSON.stringify(logEntry));
        break;
      default:
        this.logger.info(JSON.stringify(logEntry));
    }
  }

  logDatabaseOperation(
    operation: string,
    table: string,
    correlationId: string,
    tenantId: string,
    duration?: number,
    query?: string,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      type: 'database_operation',
      correlationId,
      database: {
        operation,
        table,
        duration,
        query: this.sanitizeQuery(query),
      },
      tenantId,
    };

    this.logger.debug(JSON.stringify(logEntry));
  }

  logExternalServiceCall(
    service: string,
    operation: string,
    correlationId: string,
    tenantId: string,
    duration?: number,
    success = true,
    error?: Error,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: success ? 'info' : 'error',
      type: 'external_service_call',
      correlationId,
      external: {
        service,
        operation,
        duration,
        success,
        error: error ? {
          name: error.name,
          message: error.message,
        } : undefined,
      },
      tenantId,
    };

    if (success) {
      this.logger.info(JSON.stringify(logEntry));
    } else {
      this.logger.error(JSON.stringify(logEntry));
    }
  }

  logSecurityEvent(
    event: string,
    correlationId: string,
    tenantId: string,
    userId: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    metadata?: Record<string, any>,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: severity === 'critical' || severity === 'high' ? 'error' : 'warn',
      type: 'security_event',
      correlationId,
      security: {
        event,
        severity,
        tenantId,
        userId,
        metadata: this.sanitizeMetadata(metadata),
      },
    };

    if (severity === 'critical' || severity === 'high') {
      this.logger.error(JSON.stringify(logEntry));
    } else {
      this.logger.warn(JSON.stringify(logEntry));
    }
  }

  private sanitizeHeaders(headers: any): Record<string, any> {
    if (!headers) return {};

    const sanitized = { ...headers };
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token',
      'authentication',
    ];

    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'auth',
      'credential',
      'accessToken',
      'refreshToken',
      'authorization',
      'cpf',
      'cnpj',
      'senha',
      'pin',
      'cvv',
      'image',
      'avatar',
      'presignedImageUrl',
      'document',
    ];

    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;

      const result = Array.isArray(obj) ? [] : {};

      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          result[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          result[key] = sanitizeObject(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }

      return result;
    };

    return sanitizeObject(sanitized);
  }

  private sanitizeMetadata(metadata: Record<string, any> | undefined): Record<string, any> | undefined {
    if (!metadata) return metadata;
    return this.sanitizeBody(metadata);
  }

  private sanitizeQuery(query: string | undefined): string | undefined {
    if (!query) return query;

    // Remove sensitive data from SQL queries
    return query
      .replace(/password\s*=\s*['"][^'"]*['"]/gi, "password='[REDACTED]'")
      .replace(/token\s*=\s*['"][^'"]*['"]/gi, "token='[REDACTED]'")
      .replace(/secret\s*=\s*['"][^'"]*['"]/gi, "secret='[REDACTED]'");
  }

  private calculateResponseSize(data: any): number {
    try {
      if (data === undefined) {
        return 0;
      }
      const serialized = JSON.stringify(data);
      return serialized === undefined ? 0 : serialized.length;
    } catch {
      return 0;
    }
  }
}