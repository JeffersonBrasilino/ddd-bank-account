import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram, metrics } from '@opentelemetry/api';

@Injectable()
export class GlobalMetricsService {
  private httpRequestsTotal!: Counter;
  private httpRequestDuration!: Histogram;
  private httpRequestSize!: Histogram;
  private httpResponseSize!: Histogram;

  private businessOperationsTotal!: Counter;
  private businessOperationDuration!: Histogram;
  private businessErrorsTotal!: Counter;

  private systemMemoryUsage!: Gauge;
  private systemCpuUsage!: Gauge;
  private systemActiveConnections!: Gauge;

  private tenantOperationsTotal!: Counter;
  private tenantActiveUsers!: Gauge;
  private tenantResourceUsage!: Gauge;

  private userPermissionsCacheLookups!: Counter;

  constructor() {
    this.initializeGlobalMetrics();
  }

  private initializeGlobalMetrics(): void {
    const meter = metrics.getMeter('ddd-bank-account-metrics', '1.0.0');

    this.httpRequestsTotal = meter.createCounter('http_requests_total', {
      description: 'Total number of HTTP requests',
    });

    this.httpRequestDuration = meter.createHistogram(
      'http_request_duration_ms',
      {
        description: 'HTTP request duration in milliseconds',
        unit: 'ms',
      },
    );

    this.httpRequestSize = meter.createHistogram('http_request_size_bytes', {
      description: 'HTTP request size in bytes',
      unit: 'bytes',
    });

    this.httpResponseSize = meter.createHistogram('http_response_size_bytes', {
      description: 'HTTP response size in bytes',
      unit: 'bytes',
    });

    this.businessOperationsTotal = meter.createCounter(
      'business_operations_total',
      {
        description: 'Total number of business operations',
      },
    );

    this.businessOperationDuration = meter.createHistogram(
      'business_operation_duration_ms',
      {
        description: 'Business operation duration in milliseconds',
        unit: 'ms',
      },
    );

    this.businessErrorsTotal = meter.createCounter('business_errors_total', {
      description: 'Total number of business operation errors',
    });

    this.systemMemoryUsage = meter.createGauge('system_memory_usage_bytes', {
      description: 'System memory usage in bytes',
      unit: 'bytes',
    });

    this.systemCpuUsage = meter.createGauge('system_cpu_usage_percent', {
      description: 'System CPU usage percentage',
      unit: 'percent',
    });

    this.systemActiveConnections = meter.createGauge(
      'system_active_connections_total',
      {
        description: 'Total number of active connections',
      },
    );

    this.tenantOperationsTotal = meter.createCounter(
      'tenant_operations_total',
      {
        description: 'Total operations per tenant',
      },
    );

    this.tenantActiveUsers = meter.createGauge('tenant_active_users', {
      description: 'Active users per tenant',
    });

    this.tenantResourceUsage = meter.createGauge('tenant_resource_usage', {
      description: 'Resource usage per tenant',
    });

    this.userPermissionsCacheLookups = meter.createCounter(
      'auth_user_permissions_cache_lookups_total',
      {
        description:
          'User permissions Redis cache lookups (hit or miss, OpenTelemetry)',
      },
    );
  }

  recordUserPermissionsCacheLookup(result: 'hit' | 'miss'): void {
    this.userPermissionsCacheLookups.add(1, { result });
  }

  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
    tenantId?: string,
    userId?: string,
  ): void {
    const labels = {
      method,
      route,
      status_code: statusCode.toString(),
      tenant_id: tenantId || 'unknown',
      user_id: userId || 'anonymous',
    };

    this.httpRequestsTotal.add(1, labels);
    this.httpRequestDuration.record(duration, {
      method,
      route,
      status_code: statusCode.toString(),
      tenant_id: tenantId || 'unknown',
    });
  }

  recordHttpError(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
    errorType: string,
    tenantId?: string,
    userId?: string,
  ): void {
    const labels = {
      method,
      route,
      status_code: statusCode.toString(),
      error_type: errorType,
      tenant_id: tenantId || 'unknown',
      user_id: userId || 'anonymous',
    };

    this.httpRequestsTotal.add(1, labels);
    this.httpRequestDuration.record(duration, {
      method,
      route,
      status_code: statusCode.toString(),
      tenant_id: tenantId || 'unknown',
    });
  }

  recordBusinessOperation(
    operation: string,
    module: string,
    duration: number,
    success: boolean,
    tenantId: string,
    userId: string,
  ): void {
    const labels = {
      operation,
      module,
      success: success.toString(),
      tenant_id: tenantId,
      user_id: userId,
    };

    this.businessOperationsTotal.add(1, labels);
    this.businessOperationDuration.record(duration, {
      operation,
      module,
      tenant_id: tenantId,
    });

    if (!success) {
      this.businessErrorsTotal.add(1, {
        operation,
        module,
        tenant_id: tenantId,
        user_id: userId,
      });
    }
  }

  recordSystemMetrics(): void {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    this.systemMemoryUsage.record(memUsage.heapUsed, {
      type: 'heap_used',
    });

    this.systemMemoryUsage.record(memUsage.heapTotal, {
      type: 'heap_total',
    });

    this.systemMemoryUsage.record(memUsage.rss, {
      type: 'rss',
    });

    this.systemCpuUsage.record(cpuUsage.user + cpuUsage.system, {
      type: 'total',
    });
  }

  recordTenantOperation(tenantId: string, operationType: string): void {
    this.tenantOperationsTotal.add(1, {
      tenant_id: tenantId,
      operation_type: operationType,
    });
  }

  recordTenantActiveUsers(tenantId: string, count: number): void {
    this.tenantActiveUsers.record(count, { tenant_id: tenantId });
  }

  recordTenantResourceUsage(
    tenantId: string,
    resourceType: string,
    usage: number,
  ): void {
    this.tenantResourceUsage.record(usage, {
      tenant_id: tenantId,
      resource_type: resourceType,
    });
  }

  async getTotalRequests(): Promise<number> {
    return 0;
  }

  async getRequestsPerSecond(): Promise<number> {
    return 0;
  }

  async getAverageResponseTime(): Promise<number> {
    return 0;
  }

  async getBusinessOperationsPerMinute(): Promise<number> {
    return 0;
  }

  async getBusinessErrorRate(): Promise<number> {
    return 0;
  }

  async getTopBusinessOperations(): Promise<
    Array<{ operation: string; count: number }>
  > {
    return [];
  }

  async getActiveConnections(): Promise<number> {
    return 0;
  }

  async getActiveTenants(): Promise<number> {
    return 0;
  }

  async getOperationsByTenant(): Promise<Record<string, number>> {
    return {};
  }
}
