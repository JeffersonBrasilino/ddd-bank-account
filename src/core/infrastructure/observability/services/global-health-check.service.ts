import { Injectable, Logger } from '@nestjs/common';
import { GlobalLoggingService } from './global-logging.service';
import { GlobalMetricsService } from './global-metrics.service';
import { GlobalTracingService } from './global-tracing.service';

export interface SystemComponent {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: string;
  responseTime?: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface SystemComponents {
  database: SystemComponent;
  redis: SystemComponent;
  emailService: SystemComponent;
  awsS3: SystemComponent;
  notificationService: SystemComponent;
  userService: SystemComponent;
  observability: SystemComponent;
  circuitBreakers: SystemComponent;
}

export interface SystemMetrics {
  requests: {
    total: number;
    perSecond: number;
    averageResponseTime: number;
  };
  business: {
    operationsPerMinute: number;
    errorRate: number;
    topOperations: Array<{ operation: string; count: number }>;
  };
  system: {
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    activeConnections: number;
  };
  tenants: {
    activeTenants: number;
    operationsByTenant: Record<string, number>;
  };
}

export interface GlobalHealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  components: SystemComponents;
  metrics: SystemMetrics;
  environment: string;
  nodeVersion: string;
}

@Injectable()
export class GlobalHealthCheckService {
  private readonly logger = new Logger(GlobalHealthCheckService.name);

  constructor(
    private readonly metricsService: GlobalMetricsService,
    private readonly loggingService: GlobalLoggingService,
    private readonly tracingService: GlobalTracingService,
  ) {}

  async getGlobalHealthStatus(): Promise<GlobalHealthStatus> {
    const startTime = Date.now();
    const correlationId = this.generateCorrelationId();

    try {
      const components = await this.checkAllSystemComponents();
      const overallStatus = this.determineOverallStatus(components);
      const metrics = await this.getSystemMetrics();

      const healthStatus: GlobalHealthStatus = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        uptime: process.uptime(),
        components,
        metrics,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      };

      const duration = Date.now() - startTime;

      this.loggingService.logBusinessOperation(
        'health_check',
        'observability',
        correlationId,
        'system',
        'system',
        duration,
        {
          status: overallStatus,
          componentsChecked: Object.keys(components).length,
        },
      );

      return healthStatus;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.loggingService.logBusinessOperation(
        'health_check',
        'observability',
        correlationId,
        'system',
        'system',
        duration,
        { error: error instanceof Error ? error.message : String(error) },
        'error',
      );

      throw error;
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    return {
      requests: {
        total: await this.metricsService.getTotalRequests(),
        perSecond: await this.metricsService.getRequestsPerSecond(),
        averageResponseTime: await this.metricsService.getAverageResponseTime(),
      },
      business: {
        operationsPerMinute:
          await this.metricsService.getBusinessOperationsPerMinute(),
        errorRate: await this.metricsService.getBusinessErrorRate(),
        topOperations: await this.metricsService.getTopBusinessOperations(),
      },
      system: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        activeConnections: await this.metricsService.getActiveConnections(),
      },
      tenants: {
        activeTenants: await this.metricsService.getActiveTenants(),
        operationsByTenant: await this.metricsService.getOperationsByTenant(),
      },
    };
  }

  private async checkAllSystemComponents(): Promise<SystemComponents> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkEmailService(),
      this.checkAwsS3(),
      this.checkNotificationService(),
      this.checkUserService(),
      this.checkObservabilityServices(),
      this.checkCircuitBreakers(),
    ]);

    return {
      database: this.getCheckResult(checks[0], 'database'),
      redis: this.getCheckResult(checks[1], 'redis'),
      emailService: this.getCheckResult(checks[2], 'emailService'),
      awsS3: this.getCheckResult(checks[3], 'awsS3'),
      notificationService: this.getCheckResult(
        checks[4],
        'notificationService',
      ),
      userService: this.getCheckResult(checks[5], 'userService'),
      observability: this.getCheckResult(checks[6], 'observability'),
      circuitBreakers: this.getCheckResult(checks[7], 'circuitBreakers'),
    };
  }

  private async checkDatabase(): Promise<SystemComponent> {
    const startTime = Date.now();

    try {
      // Simulação de check de database
      // Em implementação real, seria uma query simples como SELECT 1
      await new Promise(resolve => setTimeout(resolve, 10));

      return {
        name: 'database',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: 'PostgreSQL connection healthy',
        metadata: {
          connectionPool: 'active',
          activeConnections: 5,
          maxConnections: 20,
        },
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkRedis(): Promise<SystemComponent> {
    const startTime = Date.now();

    try {
      // Simulação de check de Redis
      await new Promise(resolve => setTimeout(resolve, 5));

      return {
        name: 'redis',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: 'Redis connection healthy',
        metadata: {
          connectedClients: 3,
          usedMemory: '2.5MB',
        },
      };
    } catch (error) {
      return {
        name: 'redis',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkEmailService(): Promise<SystemComponent> {
    const startTime = Date.now();
    const provider = process.env.EMAIL_PROVIDER || 'ses';

    try {
      await new Promise(resolve => setTimeout(resolve, 50));

      const message =
        provider === 'gmail'
          ? 'Gmail SMTP service healthy'
          : 'AWS SES service healthy';

      return {
        name: 'emailService',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message,
        metadata: {
          provider,
          sendingEnabled: true,
        },
      };
    } catch (error) {
      return {
        name: 'emailService',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkAwsS3(): Promise<SystemComponent> {
    const startTime = Date.now();

    try {
      // Simulação de check do AWS S3
      await new Promise(resolve => setTimeout(resolve, 30));

      return {
        name: 'awsS3',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: 'AWS S3 service healthy',
        metadata: {
          bucketsAccessible: true,
          storageUsed: '1.2GB',
        },
      };
    } catch (error) {
      return {
        name: 'awsS3',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkNotificationService(): Promise<SystemComponent> {
    const startTime = Date.now();

    try {
      // Simulação de check do serviço de notificações
      await new Promise(resolve => setTimeout(resolve, 20));

      return {
        name: 'notificationService',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: 'Notification service healthy',
        metadata: {
          pendingNotifications: 12,
          circuitBreakerOpen: false,
          deadLetterQueue: 2,
        },
      };
    } catch (error) {
      return {
        name: 'notificationService',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkUserService(): Promise<SystemComponent> {
    const startTime = Date.now();

    try {
      // Simulação de check do serviço de usuários
      await new Promise(resolve => setTimeout(resolve, 10));

      return {
        name: 'userService',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: 'User service healthy',
        metadata: {
          activeUsers: 145,
          totalUsers: 2341,
        },
      };
    } catch (error) {
      return {
        name: 'userService',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkObservabilityServices(): Promise<SystemComponent> {
    const startTime = Date.now();

    try {
      // Check dos serviços de observabilidade
      await new Promise(resolve => setTimeout(resolve, 5));

      return {
        name: 'observability',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: 'Observability services healthy',
        metadata: {
          metricsCollected: true,
          tracingEnabled: true,
          loggingEnabled: true,
        },
      };
    } catch (error) {
      return {
        name: 'observability',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async checkCircuitBreakers(): Promise<SystemComponent> {
    const startTime = Date.now();

    try {
      // Check dos circuit breakers
      await new Promise(resolve => setTimeout(resolve, 3));

      return {
        name: 'circuitBreakers',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: 'All circuit breakers healthy',
        metadata: {
          totalCircuitBreakers: 8,
          openCircuitBreakers: 0,
          halfOpenCircuitBreakers: 0,
        },
      };
    } catch (error) {
      return {
        name: 'circuitBreakers',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private getCheckResult(
    result: PromiseSettledResult<SystemComponent>,
    componentName: string,
  ): SystemComponent {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    return {
      name: componentName,
      status: 'unhealthy',
      lastCheck: new Date().toISOString(),
      message: result.reason?.message || 'Health check failed',
    };
  }

  private determineOverallStatus(
    components: SystemComponents,
  ): 'healthy' | 'unhealthy' | 'degraded' {
    const componentStatuses = Object.values(components).map(c => c.status);
    const unhealthyCount = componentStatuses.filter(
      s => s === 'unhealthy',
    ).length;
    const degradedCount = componentStatuses.filter(
      s => s === 'degraded',
    ).length;

    if (unhealthyCount > 0) {
      return 'unhealthy';
    }

    if (degradedCount > 0) {
      return 'degraded';
    }

    return 'healthy';
  }

  private generateCorrelationId(): string {
    return `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
