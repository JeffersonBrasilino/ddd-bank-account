# 🌐 **EXEMPLOS DE USO - OBSERVABILIDADE GLOBAL**

## 📋 **Como usar os Decorators**

### **1. Business Operations**

```typescript
import { GlobalBusinessOperation } from '@core/infrastructure/observability/decorators/global-business-operation.decorator';

@Injectable()
export class UserService {
  // Operação simples
  @GlobalBusinessOperation('create_user', 'user')
  async createUser(userData: CreateUserDto): Promise<User> {
    // Business logic here
    return user;
  }

  // Operação com configurações customizadas
  @GlobalBusinessOperation({
    operation: 'update_user_profile',
    module: 'user',
    logLevel: 'log',
    skipMetrics: false,
  })
  async updateProfile(userId: string, data: UpdateProfileDto): Promise<User> {
    // Business logic here
    return user;
  }

  // Operação crítica
  @GlobalCriticalOperation('delete_user', 'user')
  async deleteUser(userId: string): Promise<void> {
    // Critical business logic here
  }
}
```

### **2. Database Operations**

```typescript
import { GlobalDatabaseOperation } from '@core/infrastructure/observability/decorators/global-business-operation.decorator';

@Injectable()
export class UserRepository {
  @GlobalDatabaseOperation('find_user', 'users')
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  @GlobalDatabaseOperation('create_user', 'users')
  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
```

### **3. External Service Calls**

```typescript
import { GlobalExternalServiceOperation } from '@core/infrastructure/observability/decorators/global-business-operation.decorator';

@Injectable()
export class EmailService {
  @GlobalExternalServiceOperation('aws_ses', 'send_email')
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Call to AWS SES
  }

  @GlobalExternalServiceOperation('aws_s3', 'upload_file')
  async uploadFile(file: Buffer, key: string): Promise<string> {
    // Call to AWS S3
    return fileUrl;
  }
}
```

## 🔧 **Integração com Serviços**

### **1. Adicionando Context Extraction**

```typescript
@Injectable()
export class MyService {
  constructor(
    private readonly tracingService: GlobalTracingService,
    private readonly loggingService: GlobalLoggingService,
    private readonly metricsService: GlobalMetricsService,
  ) {}

  // Método para extrair contexto de negócio
  extractBusinessContext(args: any[]): { tenantId?: string; userId?: string } {
    // Extrair contexto dos argumentos
    const command = args[0];
    return {
      tenantId: command?.tenantId,
      userId: command?.userId,
    };
  }

  // Método para sanitizar argumentos
  sanitizeArgs(args: any[]): any {
    return args.map(arg => {
      if (typeof arg === 'object') {
        const sanitized = { ...arg };
        delete sanitized.password;
        delete sanitized.token;
        return sanitized;
      }
      return arg;
    });
  }

  // Método para sanitizar resultado
  sanitizeResult(result: any): any {
    if (typeof result === 'object') {
      const sanitized = { ...result };
      delete sanitized.password;
      delete sanitized.accessToken;
      return sanitized;
    }
    return result;
  }

  @GlobalBusinessOperation('complex_operation', 'my_service')
  async complexOperation(data: any): Promise<any> {
    // Business logic here
    return result;
  }
}
```

### **2. Usando Context em Handlers**

```typescript
@Injectable()
export class CreateUserHandler {
  constructor(
    private readonly tracingService: GlobalTracingService,
    private readonly loggingService: GlobalLoggingService,
    private readonly metricsService: GlobalMetricsService,
  ) {}

  // Generate correlation ID
  generateCorrelationId(): string {
    return `handler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Extract business context from command
  extractBusinessContext(args: any[]): { tenantId?: string; userId?: string } {
    const command = args[0];
    return {
      tenantId: command.tenantId,
      userId: command.userId,
    };
  }

  @GlobalBusinessOperation('create_user', 'user')
  async execute(command: CreateUserCommand): Promise<Result<User>> {
    // Handler logic here
    return Result.success(user);
  }
}
```

## 📊 **Endpoints de Monitoramento**

### **1. Health Checks**

```typescript
// Basic health check
GET / health;
// Response: { status: "healthy", timestamp: "...", uptime: 123 }

// Quick health check
GET / health / quick;
// Response: { status: "healthy", timestamp: "..." }

// Detailed health with metrics
GET / health / metrics;
// Response: { requests: {...}, business: {...}, system: {...} }
```

### **2. Métricas Específicas**

```typescript
// HTTP request metrics
GET / health / metrics / requests;
// Response: { total: 1000, perSecond: 10, averageResponseTime: 150 }

// Business operation metrics
GET / health / metrics / business;
// Response: { operationsPerMinute: 50, errorRate: 2.5, topOperations: [...] }

// System metrics
GET / health / metrics / system;
// Response: { memoryUsage: {...}, cpuUsage: {...}, activeConnections: 25 }

// Tenant metrics
GET / health / metrics / tenants;
// Response: { activeTenants: 5, operationsByTenant: {...} }
```

### **3. Tracing**

```typescript
// Current trace context
GET / health / traces / current;
// Response: { traceId: "...", spanId: "...", isActive: true }
```

### **4. Kubernetes Probes**

```typescript
// Readiness probe
GET / health / ready;
// Response 200: Service is ready to receive traffic

// Liveness probe
GET / health / live;
// Response 200: Service is alive

// Version info
GET / health / version;
// Response: { version: "1.0.0", environment: "production", ... }
```

## 🔍 **Logs Estruturados**

### **Exemplo de Log de Request HTTP**

```json
{
  "timestamp": "2024-01-01T10:00:00Z",
  "level": "info",
  "type": "http_request",
  "correlationId": "global_1704096000000_abc123",
  "method": "POST",
  "url": "/api/users",
  "route": "/api/users",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.100",
  "tenantId": "tenant-123",
  "userId": "user-456",
  "headers": {
    "content-type": "application/json",
    "authorization": "[REDACTED]"
  },
  "query": {},
  "body": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "[REDACTED]"
  }
}
```

### **Exemplo de Log de Business Operation**

```json
{
  "timestamp": "2024-01-01T10:00:01Z",
  "level": "info",
  "type": "business_operation",
  "correlationId": "business_1704096001000_def456",
  "operation": "create_user",
  "module": "user",
  "tenantId": "tenant-123",
  "userId": "user-456",
  "duration": 250,
  "metadata": {
    "phase": "success",
    "result": {
      "id": "new-user-789",
      "name": "John Doe"
    }
  }
}
```

## 📈 **Métricas Disponíveis**

### **HTTP Metrics**

- `http_requests_total{method, route, status_code, tenant_id, user_id}`
- `http_request_duration_ms{method, route, status_code, tenant_id}`
- `http_request_size_bytes{method, route, tenant_id}`
- `http_response_size_bytes{method, route, status_code, tenant_id}`

### **Business Metrics**

- `business_operations_total{operation, module, success, tenant_id, user_id}`
- `business_operation_duration_ms{operation, module, tenant_id}`
- `business_errors_total{operation, module, error_type, tenant_id, user_id}`

### **System Metrics**

- `system_memory_usage_bytes{type}`
- `system_cpu_usage_percent{type}`
- `system_active_connections_total`

### **Tenant Metrics**

- `tenant_operations_total{tenant_id, operation_type}`
- `tenant_active_users{tenant_id}`
- `tenant_resource_usage{tenant_id, resource_type}`

## 🚨 **Alertas e Monitoramento**

### **Configuração de Alertas**

```yaml
# Prometheus Alert Rules
groups:
  - name: protegio_backend_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(business_errors_total[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is {{ $value }} errors/second'

      - alert: SlowResponses
        expr: histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m])) > 5000
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: 'Slow HTTP responses'
          description: '95th percentile response time is {{ $value }}ms'
```

## 🐳 **Docker e Kubernetes**

### **Docker Compose Example**

```yaml
version: '3.8'
services:
  protegio-backend:
    build: .
    environment:
      - ENABLE_GLOBAL_TELEMETRY=true
      - GLOBAL_JAEGER_ENDPOINT=http://jaeger:14268/api/traces
      - GLOBAL_PROMETHEUS_PORT=9090
    ports:
      - '5001:5001'
      - '9090:9090'
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:5001/api/v1/health/ready']
      interval: 30s
      timeout: 10s
      retries: 3

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - '16686:16686'
      - '14268:14268'

  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9091:9090'
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
```

### **Kubernetes Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: protegio-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: protegio-backend
  template:
    metadata:
      labels:
        app: protegio-backend
    spec:
      containers:
        - name: protegio-backend
          image: protegio-backend:latest
          ports:
            - containerPort: 5001
            - containerPort: 9090
          env:
            - name: ENABLE_GLOBAL_TELEMETRY
              value: 'true'
            - name: GLOBAL_PROMETHEUS_PORT
              value: '9090'
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 5001
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health/live
              port: 5001
            initialDelaySeconds: 30
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: protegio-backend-service
  annotations:
    prometheus.io/scrape: 'true'
    prometheus.io/port: '9090'
    prometheus.io/path: '/metrics'
spec:
  selector:
    app: protegio-backend
  ports:
    - name: http
      port: 5001
      targetPort: 5001
    - name: metrics
      port: 9090
      targetPort: 9090
```

## 🎉 **Próximos Passos**

1. **Configurar Jaeger** para visualização de traces
2. **Configurar Prometheus** para coleta de métricas
3. **Configurar Grafana** para dashboards
4. **Configurar alertas** no Prometheus/AlertManager
5. **Integrar com Sentry** para error tracking
6. **Adicionar custom metrics** específicas do negócio
