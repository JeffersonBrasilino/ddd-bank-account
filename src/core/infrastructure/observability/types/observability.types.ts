export interface CorrelationContext {
  correlationId: string;
  tenantId?: string;
  userId?: string;
  requestId?: string;
  sessionId?: string;
}

export interface BusinessOperationContext extends CorrelationContext {
  operation: string;
  module: string;
  startTime: number;
}

export interface HttpRequestContext extends CorrelationContext {
  method: string;
  url: string;
  route?: string;
  userAgent?: string;
  ip?: string;
  headers?: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
}

export interface DatabaseOperationContext extends CorrelationContext {
  operation: string;
  table: string;
  query?: string;
  duration?: number;
}

export interface ExternalServiceContext extends CorrelationContext {
  service: string;
  operation: string;
  endpoint?: string;
  duration?: number;
  success?: boolean;
}

export interface SecurityEventContext extends CorrelationContext {
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface ObservabilityConfig {
  enabled: boolean;
  logging: {
    enabled: boolean;
    level: 'error' | 'warn' | 'log' | 'debug' | 'verbose';
    format: 'json' | 'text';
    sanitization: boolean;
  };
  metrics: {
    enabled: boolean;
    exportInterval: number;
    retentionDays: number;
  };
  tracing: {
    enabled: boolean;
    sampleRate: number;
    jaegerEndpoint?: string;
  };
  healthCheck: {
    enabled: boolean;
    interval: number;
    timeout: number;
  };
}

export type LogLevel = 'error' | 'warn' | 'log' | 'debug' | 'verbose';
export type ComponentStatus = 'healthy' | 'unhealthy' | 'degraded';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface MetricLabels {
  [key: string]: string | number;
}

export interface SpanAttributes {
  [key: string]: string | number | boolean;
}