import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GlobalHealthCheckService,
  GlobalHealthStatus,
  SystemMetrics,
} from '../services/global-health-check.service';
import { GlobalTracingService } from '../services/global-tracing.service';

@ApiTags('Global Health')
@ApiBearerAuth('bearer')
@Controller('health')
export class GlobalHealthController {
  constructor(
    private readonly healthCheckService: GlobalHealthCheckService,
    private readonly tracingService: GlobalTracingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get global system health status' })
  @ApiResponse({
    status: 200,
    description: 'Health status retrieved successfully',
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable - system is unhealthy',
  })
  async getGlobalHealth(): Promise<GlobalHealthStatus> {
    const healthStatus = await this.healthCheckService.getGlobalHealthStatus();

    // Return appropriate HTTP status based on health
    if (healthStatus.status === 'unhealthy') {
      throw new Error('System is unhealthy');
    }

    return healthStatus;
  }

  @Get('quick')
  @ApiOperation({ summary: 'Quick health check - returns minimal status' })
  @ApiResponse({
    status: 200,
    description: 'System is healthy',
  })
  @ApiResponse({
    status: 503,
    description: 'System is unhealthy',
  })
  async getQuickHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const healthStatus = await this.healthCheckService.getGlobalHealthStatus();
      return {
        status: healthStatus.status,
        timestamp: healthStatus.timestamp,
      };
    } catch {
      throw new Error('Quick health check failed');
    }
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get global system metrics' })
  @ApiResponse({
    status: 200,
    description: 'Metrics retrieved successfully',
  })
  async getGlobalMetrics(): Promise<SystemMetrics> {
    return this.healthCheckService.getSystemMetrics();
  }

  @Get('metrics/requests')
  @ApiOperation({ summary: 'Get HTTP request metrics' })
  async getRequestMetrics(): Promise<{
    total: number;
    perSecond: number;
    averageResponseTime: number;
  }> {
    const metrics = await this.healthCheckService.getSystemMetrics();
    return metrics.requests;
  }

  @Get('metrics/business')
  @ApiOperation({ summary: 'Get business operation metrics' })
  async getBusinessMetrics(): Promise<{
    operationsPerMinute: number;
    errorRate: number;
    topOperations: Array<{ operation: string; count: number }>;
  }> {
    const metrics = await this.healthCheckService.getSystemMetrics();
    return metrics.business;
  }

  @Get('metrics/system')
  @ApiOperation({ summary: 'Get system resource metrics' })
  async getSystemMetrics(): Promise<{
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    activeConnections: number;
  }> {
    const metrics = await this.healthCheckService.getSystemMetrics();
    return metrics.system;
  }

  @Get('metrics/tenants')
  @ApiOperation({ summary: 'Get tenant-specific metrics' })
  async getTenantMetrics(): Promise<{
    activeTenants: number;
    operationsByTenant: Record<string, number>;
  }> {
    const metrics = await this.healthCheckService.getSystemMetrics();
    return metrics.tenants;
  }

  @Get('traces/current')
  @ApiOperation({ summary: 'Get current trace context' })
  @ApiResponse({
    status: 200,
    description: 'Current trace context retrieved',
  })
  async getCurrentTrace(): Promise<any> {
    const traceContext = this.tracingService.getCurrentTraceContext();

    if (!traceContext) {
      return {
        message: 'No active trace context',
        timestamp: new Date().toISOString(),
      };
    }

    return traceContext;
  }

  @Get('ready')
  @ApiOperation({ summary: 'Kubernetes readiness probe' })
  @ApiResponse({
    status: 200,
    description: 'Service is ready to receive traffic',
  })
  @ApiResponse({
    status: 503,
    description: 'Service is not ready',
  })
  async getReadiness(): Promise<{ status: string; timestamp: string }> {
    try {
      const healthStatus = await this.healthCheckService.getGlobalHealthStatus();

      // Service is ready if it's healthy or degraded, but not unhealthy
      const isReady = healthStatus.status !== 'unhealthy';

      if (!isReady) {
        throw new Error('Service is not ready');
      }

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new Error('Readiness check failed');
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Kubernetes liveness probe' })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
  })
  async getLiveness(): Promise<{ status: string; timestamp: string; uptime: number }> {
    // Liveness check - basic service availability
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Get application version and build info' })
  async getVersion(): Promise<{
    version: string;
    buildTime?: string;
    gitCommit?: string;
    environment: string;
    nodeVersion: string;
    uptime: number;
  }> {
    return {
      version: process.env.npm_package_version || '1.0.0',
      buildTime: process.env.BUILD_TIME,
      gitCommit: process.env.GIT_COMMIT,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      uptime: process.uptime(),
    };
  }
}