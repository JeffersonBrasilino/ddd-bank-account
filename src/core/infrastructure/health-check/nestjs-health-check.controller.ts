import { ApiPublic } from '@core/infrastructure/http/nestjs/decorators/api-public';
import { PublicRoute } from '@core/infrastructure/http/nestjs/decorators/public-route';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { NestjsHealthCheckService } from './nestjs-health-check.service';

export interface ICheckEndpoint<T> {
  check(): Promise<T>;
}

@ApiTags('Health')
@ApiPublic()
@Controller('health')
export class NestjsHealthCheckController
  implements ICheckEndpoint<HealthCheckResult>
{
  constructor(
    private readonly nestjsHealthCheckService: NestjsHealthCheckService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns service health status.' })
  @ApiResponse({ status: 200, description: 'Service healthy.' })
  @ApiResponse({ status: 503, description: 'Service unavailable.' })
  @PublicRoute({ active: true, checkAppAuthorization: false })
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.nestjsHealthCheckService.check();
  }
}
