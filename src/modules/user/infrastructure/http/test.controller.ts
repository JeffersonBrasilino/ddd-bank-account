import {
  HttpResponse,
  HttpResponseProps,
} from '@core/infrastructure/http/http-response';
import { Body, Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

const controllerName = 'test';
@ApiTags(controllerName)
@Controller(controllerName)
@ApiBearerAuth()
export class TestController {
  constructor() {}
  @Get()
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
  async checkCodeRecoveryPassword(@Body() data: any) {
    return HttpResponse.ok('okokokokokokokook');
  }

  private processError(errorResult): HttpResponseProps {
    return HttpResponse.internalServerError(errorResult.getError());
  }
}
