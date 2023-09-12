import { ActionFactory } from '@core/application';
import { AbstractController } from '@core/infrastructure/http';
import {
  HttpResponse,
  HttpResponseProps,
} from '@core/infrastructure/http/http-response';
import { PublicRoute } from '@core/infrastructure/http/nestjs/decorators/public-route';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { actions } from '../../cqrs';

@ApiTags('user')
@Controller('user/exists')
@PublicRoute()
export class UserExistsController extends AbstractController {
  constructor(
    private cb: CommandBus,
    @Inject('ActionFactory') private commandFactory: ActionFactory<actions>,
  ) {
    super();
  }
  @Get(':cpf')
  @ApiOperation({
    summary: 'Verifica se o usuario existe.',
    description: 'Verifica se o usuario existe em alguma das aplicacoes, ',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: { example: { status: 200, data: { firstLogin: 'true' } } },
    },
    description: 'Quando a busca for bem sucedida.',
  })
  @ApiResponse({
    status: 400,
    content: {
      json: { example: { status: 400, data: 'cpf incorreto' } },
    },
    description: 'cpf informado incorreto.',
  })
  @ApiParam({ name: 'cpf', type: 'string' })
  async login(@Param() params): Promise<HttpResponseProps> {
    const command = this.commandFactory.create('userExists', params);
    const result = await this.cb.execute(command);
    if (result.isFailure()) {
      return this.processError(result.getError());
    }
    return HttpResponse.ok(result.getValue());
  }
}
