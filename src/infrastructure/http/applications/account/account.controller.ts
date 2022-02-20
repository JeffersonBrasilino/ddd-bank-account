import {
  Body,
  Controller,
  Post,
  Res,
  Put,
  Inject,
  Param,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpResponse } from '@core/infrastructure/http-response';
import { CreateAccountUseCase } from '@applications/account/application/use-case/create-account/create-account.use-case';
import { AccountDto } from './account.dto';
import { AccountCreditDto } from './account-credit.dto';
import { AccountDebitDto } from './account-debit.dto';
import { AccountCreditUseCase } from '@applications/account/application/use-case/account-credit/account-credit.use-case';
import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
import { AccountCreditDto as AccountCreditDtoDomain } from '@applications/account/application/use-case/account-credit/account-credit.dto';
import { AccountDebitDto as AccountDebitDtoDomain } from '@applications/account/application/use-case/account-debit/account-debit.dto';
import { AccountDebitUseCase } from '@applications/account/application/use-case/account-debit/account-debit.use-case';
import { AccountBalanceUseCase } from '@applications/account/application/use-case/account-balance/account-balance.use-case';
import { AccountTransferDto } from './account-transfer.dto';
import { AccountTransferUseCase } from '@applications/account/application/use-case/account-transfer/account-transfer.use-case';

@Controller('account')
@ApiResponse({
  status: 404,
  content: {
    json: {
      example: {
        status: 404,
      },
    },
  },
  description: 'Quando a rota ou recurso não existir',
})
@ApiResponse({
  status: 500,
  content: {
    json: {
      example: {
        status: 500,
        err: 'mensagem de erro...',
      },
    },
  },
  description: 'erro na requisicao',
})
@ApiResponse({
  status: 400,
  content: {
    json: {
      example: {
        statusCode: 400,
        message: ['campo1', 'campo2'],
        error: 'Bad Request',
      },
    },
  },
  description: 'dados obrigatorios ausentes.',
})
@ApiTags('Account')
export class AccountController {
  constructor(
    @Inject('IAccountRepository') private _repo: IAccountRepository,
  ) {}

  @ApiOperation({
    summary: 'retorna o saldo da conta.',
    description: 'realiza a consulta e retorna o saldo da conta.',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: {
        example: {
          id: '1f0d94b0-a626-427d-8c4e-62b8930096e3',
          value: 30,
          createdAt: '2022-02-20T05:51:41.054Z',
        },
      },
    },
    description: 'Quando a solicitacao for bem sucedida.',
  })
  @ApiParam({ name: 'id', description: 'id da conta' })
  @Get(':id/balance')
  async getBalance(@Param('id') uuid: string, @Res() res: Response) {
    try {
      const a = await new AccountBalanceUseCase(this._repo).execute(uuid);
      return HttpResponse.ok(res, a);
    } catch (e) {
      const error = e.message;
      if (error == 'NOT_FOUND') return HttpResponse.notFound(res);

      return HttpResponse.internalServerError(res, e.toString());
    }
  }

  @ApiOperation({
    summary: 'cria a conta.',
    description:
      'cria a conta para a pessoa, somente é permitido uma conta por CPF',
  })
  @ApiResponse({
    status: 201,
    content: {
      json: {
        example: {
          status: 201,
          data: {
            id: 'd3aac182-7c20-42fa-81ed-181f09b0dcde',
          },
        },
      },
    },
    description: 'conta criada com sucesso.',
  })
  @ApiResponse({
    status: 409,
    content: {
      json: {
        example: {
          status: 409,
          err: 'ja existe uma conta para este cpf',
        },
      },
    },
    description: 'quando existir uma conta para o cpf',
  })
  @Post('create')
  async login(@Body() body: AccountDto, @Res() res: Response) {
    try {
      const a = await new CreateAccountUseCase(this._repo).execute(body);
      return HttpResponse.created(res, a);
    } catch (e) {
      const error = e.message;
      if (error == 'NOT_FOUND') return HttpResponse.notFound(res);
      if (error == 'CONFLICT')
        return HttpResponse.conflict(res, 'ja existe uma conta para este cpf');

      return HttpResponse.internalServerError(res, e.toString());
    }
  }

  @ApiOperation({
    summary: 'transferencia entre contas.',
    description: 'realiza atransferencia de valor entre contas.',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: {
        example: {
          status: 200,
          data: true,
        },
      },
    },
    description: 'transferencia realizada com sucesso',
  })
  @Post('transfer')
  async accountTransfer(
    @Body() body: AccountTransferDto,
    @Res() res: Response,
  ) {
    try {
      const a = await new AccountTransferUseCase(this._repo).execute(body);
      return HttpResponse.ok(res, a);
    } catch (e) {
      const error = e.message;
      if (error == 'NOT_FOUND') return HttpResponse.notFound(res);

      return HttpResponse.internalServerError(res, e.toString());
    }
  }

  @ApiOperation({
    summary: 'Credita a conta.',
    description:
      'realiza o credito do valor na conta. o valor não pode ser negativo.',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: {
        example: {
          status: 200,
          data: {
            id: '73519089-d0e8-4b89-af36-dfd046d034d3',
          },
        },
      },
    },
    description: 'credito adicionado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'id da conta' })
  @Put(':id/credit')
  async accountCredit(
    @Param('id') id: string,
    @Body() body: AccountCreditDto,
    @Res() res: Response,
  ) {
    try {
      const data: AccountCreditDtoDomain = {
        accountId: id,
        value: body.value,
      };
      const a = await new AccountCreditUseCase(this._repo).execute(data);
      return HttpResponse.ok(res, a);
    } catch (e) {
      const error = e.message;
      if (error == 'NOT_FOUND') return HttpResponse.notFound(res);

      return HttpResponse.internalServerError(res, e.toString());
    }
  }

  @ApiOperation({
    summary: 'Debita a conta.',
    description:
      'realiza o debito do valor na conta. o valor não pode ser negativo.',
  })
  @ApiResponse({
    status: 200,
    content: {
      json: {
        example: {
          status: 200,
          data: {
            id: '73519089-d0e8-4b89-af36-dfd046d034d3',
          },
        },
      },
    },
    description: 'debito descontado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'id da conta' })
  @Put(':id/debit')
  async accountDebit(
    @Param('id') id: string,
    @Body() body: AccountDebitDto,
    @Res() res: Response,
  ) {
    try {
      const data: AccountDebitDtoDomain = {
        accountId: id,
        value: body.value,
      };
      const a = await new AccountDebitUseCase(this._repo).execute(data);
      return HttpResponse.ok(res, a);
    } catch (e) {
      const error = e.message;
      if (error == 'NOT_FOUND') return HttpResponse.notFound(res);

      return HttpResponse.internalServerError(res, e.toString());
    }
  }
}
