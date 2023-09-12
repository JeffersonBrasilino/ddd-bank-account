import { ActionFactory } from '@core/application';
import { AbstractController } from '@core/infrastructure/http';
import {
  HttpResponse,
  HttpResponseProps,
} from '@core/infrastructure/http/http-response';
import { PublicRoute } from '@core/infrastructure/http/nestjs/decorators/public-route';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { actions } from '../../cqrs';
import { UserSaveFirstLoginRequestDto } from './user-save-first-login.request.dto';
// TODO: AJUSTAR HTTP CODE STATUS DO SAVE
@ApiTags('user')
@Controller('user/save-first-login')
@PublicRoute()
export class UserSaveFirstLoginController extends AbstractController {
  constructor(
    private cb: CommandBus,
    @Inject('ActionFactory') private commandFactory: ActionFactory<actions>,
  ) {
    super();
  }
  @Post()
  @ApiOperation({
    summary: 'Salva o usuario apos checar existencia',
    description: 'salva os dados do usuario apos checar o primeiro login',
  })
  @ApiResponse({
    status: 201,
    description: 'Quando o save for bem sucedido.',
  })
  @ApiResponse({
    status: 409,
    description: 'se o usuario ja estiver cadastrado',
  })
  @ApiResponse({
    status: 400,
    content: {
      json: { example: { status: 400, data: 'cpf incorreto' } },
    },
    description: 'caso haja erro de dados.',
  })
  @ApiProperty({ type: UserSaveFirstLoginRequestDto })
  async execute(
    @Body() params: UserSaveFirstLoginRequestDto,
  ): Promise<HttpResponseProps> {
    const command = this.commandFactory.create('userSaveFirstLogin', params);
    const result = await this.cb.execute(command);
    if (result.isFailure()) {
      return this.processError(result.getError());
    }
    return HttpResponse.ok(result.getValue());
  }
}
