import { ActionFactory } from '@core/application';
import { InvalidDataError } from '@core/application/errors/invalid-data.error';
import { DataNotFoundError } from '@core/infrastructure/errors';
import {
  HttpResponse,
  HttpResponseProps,
} from '@core/infrastructure/http/http-response';
import {
  Body,
  Controller,
  Header,
  Headers,
  Inject,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { actions } from '../cqrs/actions.types';
import { LoginRequestDto } from './dtos/requests/login-request.dto';
import { RecoveryPasswordSendCodeRequest } from './dtos/requests/recovery-password-send-code.request';
import { RecoveryPasswordCheckCodeRequest } from './dtos/requests/recovery-password-check-code.request';
import { PublicRoute } from '@core/infrastructure/http/nestjs/decorators/public-route';

const controllerName = 'user';
@ApiTags(controllerName)
@Controller(controllerName)
@PublicRoute()
export class UserController {
  constructor(
    private cb: CommandBus,
    @Inject('ActionFactory') private commandFactory: ActionFactory<actions>,
  ) {}
  @Post('login')
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

  @Post('recovery-password/send-code')
  @ApiOperation({
    summary: 'envia codigo de recuperar senha',
    description:
      'envia codigo via e-mail para verificação de recuperação de senha',
  })
  @ApiResponse({
    status: 201,
    content: {
      json: { example: { status: 201, data: { userId: 'xxx' } } },
    },
    description: 'Enviado o codigo de verificação para o email com sucesso',
  })
  @ApiResponse({
    status: 400,
    content: {
      json: { example: { status: 400, data: 'usuario não encontrado' } },
    },
    description: 'Quando o usuario não for encontrado.',
  })
  @ApiResponse({
    status: 422,
    content: {
      json: { example: { status: 422, data: 'email inválido.' } },
    },
    description: 'Quando o email for inválido.',
  })
  @ApiResponse({
    status: 424,
    content: {
      json: { example: { status: 424, data: 'erro ao enviar email.' } },
    },
    description: 'Quando houver erro no envio de email',
  })
  async sendCodeRecoveryPassword(
    @Body() data: RecoveryPasswordSendCodeRequest,
  ) {
    const command = this.commandFactory.create(
      'recoveryPasswordSendCode',
      data,
    );
    const result = await this.cb.execute(command);
    if (result.isFailure()) {
      return this.processError(result.getError());
    }
    return HttpResponse.ok(result.getValue());
  }

  @Post('recovery-password/new')
  @ApiOperation({
    summary: 'recupera senha do usuario a partir do codigo de verificacao',
    description:
      'verifica e atualiza a senha do usuario, o codigo a ser verificado corresponde ao do endpoint recovery-password/send-code',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: {
        example: true,
      },
    },
    description: 'sucesso',
  })
  @ApiResponse({
    status: 404,
    content: {
      json: {
        example: {
          status: 404,
          data: 'Código de verifiação ou usuário incorreto.',
        },
      },
    },
    description: 'quando a verificacao do codigo falhar, ou userId nao existir',
  })
  async checkCodeRecoveryPassword(
    @Body() data: RecoveryPasswordCheckCodeRequest,
  ) {
    const command = this.commandFactory.create(
      'recoveryPasswordNewPassword',
      data,
    );
    const result = await this.cb.execute(command);
    if (result.isFailure()) {
      return this.processError(result.getError());
    }
    return HttpResponse.ok(result.getValue());
  }

  private processError(errorResult): HttpResponseProps {
    switch (errorResult.constructor) {
      case InvalidDataError:
        return HttpResponse.badRequest(errorResult.getError());
      case DataNotFoundError:
        return HttpResponse.notFound(errorResult.getError());
      default:
        return HttpResponse.internalServerError(errorResult.getError());
    }
  }
}
