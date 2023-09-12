import { ActionFactory } from '@core/application';
import { AbstractController } from '@core/infrastructure/http';
import {
  HttpResponse,
  HttpResponseProps,
} from '@core/infrastructure/http/http-response';
import { PublicRoute } from '@core/infrastructure/http/nestjs/decorators/public-route';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { actions } from '../../cqrs';
import { LoginRequestDto } from './login-request.dto';

@ApiTags('user')
@Controller('user/login')
@PublicRoute()
export class LoginController extends AbstractController {
  constructor(
    private cb: CommandBus,
    @Inject('ActionFactory') private commandFactory: ActionFactory<actions>,
  ) {
    super();
  }
  @Post()
  @ApiOperation({
    summary: 'Login de Usuário',
    description: 'Realiza o login do usuário',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: { example: { status: 200, data: 'hash do token' } },
    },
    description: 'Quando o login for bem sucedido.',
  })
  @ApiResponse({
    status: 400,
    content: {
      json: { example: { status: 400, data: 'Usuário ou senha incorretas' } },
    },
    description: 'Quando o usuário ou a senha for incorretas.',
  })
  @ApiBody({ type: LoginRequestDto })
  async login(@Body() data: LoginRequestDto): Promise<HttpResponseProps> {
    const command = this.commandFactory.create('login', data);
    const result = await this.cb.execute(command);
    if (result.isFailure()) {
      return this.processError(result.getError());
    }
    return HttpResponse.ok(result.getValue());
  }
}
