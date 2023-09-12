import { ActionFactory } from '@core/application';
import { AbstractController } from '@core/infrastructure/http';
import {
  HttpResponse,
  HttpResponseProps,
} from '@core/infrastructure/http/http-response';
import { PublicRoute } from '@core/infrastructure/http/nestjs/decorators/public-route';
import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { actions } from '../../cqrs';
import { RefreshAuthTokenRequestDto } from './refresh-auth-token.request.dto';

@ApiTags('user')
@Controller('user/refresh-auth-token')
@PublicRoute()
export class RefreshAuthTokenController extends AbstractController {
  constructor(
    private cb: CommandBus,
    @Inject('ActionFactory') private commandFactory: ActionFactory<actions>,
  ) {
    super();
  }
  @Patch()
  @ApiOperation({
    summary: 'Atualiza o token de autenticação do Usuário',
    description:
      'Atualiza o token de autenticação do Usuário baseado no token de atualização de credencial',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: { example: { status: 200, data: 'hash do token' } },
    },
    description: 'Quando a atualização for bem sucedido.',
  })
  @ApiResponse({
    status: 400,
    content: {
      json: { example: { status: 400, data: 'token incorreto ou expirado' } },
    },
    description: 'token incorreto ou expirado',
  })
  @ApiBody({ type: RefreshAuthTokenRequestDto })
  async execute(
    @Body() data: RefreshAuthTokenRequestDto,
  ): Promise<HttpResponseProps> {
    const command = this.commandFactory.create('refreshAuthToken', data);
    const result = await this.cb.execute(command);
    if (result.isFailure()) {
      return this.processError(result.getError());
    }
    return HttpResponse.ok(result.getValue());
  }
}
