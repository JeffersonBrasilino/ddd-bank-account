import { CreateAccountUseCase } from '@applications/account/application/use-case/create-account/create-account.use-case';
import { AccountCreditUseCase } from '@applications/account/application/use-case/account-credit/account-credit.use-case';
import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
import { AccountMapper } from '@applications/account/mapper/account.mapper';
import { AccountDebitUseCase } from '@applications/account/application/use-case/account-debit/account-debit.use-case';
import { AccountBalanceUseCase } from '@applications/account/application/use-case/account-balance/account-balance.use-case';
import { AccountTransferUseCase } from '@applications/account/application/use-case/account-transfer/account-transfer.use-case';

describe('Account Domain', () => {
  const mockAccountRepo: IAccountRepository = {
    getAccountByUuId: async (id: number | string) => {
      const data = {
        id: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
        cpf: '050.523.573-03',
        name: 'jefferson',
        createdAt: '2022-02-18T22:19:38.141Z',
        movement: {
          id: 'aa071872-f09c-4c0f-9cdb-0f2879441da7',
          value: 20,
          createdAt: '2022-02-18T22:19:38.141Z',
        },
      };
      if (id != '15721aad-d250-42ed-8e49-5bb42baaa2dd') return await null;
      return await AccountMapper.toDomain(data);
    },
    getAccountByCpf: async (cpf: string) => {
      const data = {
        id: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
        cpf: '050.523.573-03',
        name: 'jefferson',
        createdAt: '2022-02-18T22:19:38.141Z',
        movement: {
          id: 'aa071872-f09c-4c0f-9cdb-0f2879441da7',
          value: 20,
          createdAt: '2022-02-18T22:19:38.141Z',
        },
      };
      if (cpf == '05052357303') return await null;
      return await AccountMapper.toDomain(data);
    },

    save: async (account) => {
      const data = {
        id: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
        cpf: '050.523.573-03',
        name: 'jefferson',
        createdAt: '2022-02-18T22:19:38.141Z',
        movement: {
          id: 'aa071872-f09c-4c0f-9cdb-0f2879441da7',
          value: 20,
          createdAt: '2022-02-18T22:19:38.141Z',
        },
      };
      return await AccountMapper.toDomain(data);
    },
  };

  describe('Account create', () => {
    let createAccountUseCase: CreateAccountUseCase;
    beforeEach(() => {
      createAccountUseCase = new CreateAccountUseCase(mockAccountRepo);
    });
    it('Quando tentar criar uma conta com VALIDOS, criar.', async () => {
      await expect(
        createAccountUseCase.execute({
          cpf: '050.523.573-03',
          name: 'huehuebrbr',
          movement: { value: 20 },
        }),
      ).resolves.toHaveProperty('id');
    });

    it('Quando tentar criar uma conta com CPF INVALIDO, retornar erro.', async () => {
      await expect(
        createAccountUseCase.execute({
          cpf: '050.523.5703',
          name: 'huehuebrbr',
          movement: { value: 20 },
        }),
      ).rejects.toThrow('cpf invalido');
    });

    it('Quando tentar criar uma conta com CPF JA EXISTENTE, retornar erro.', async () => {
      await expect(
        createAccountUseCase.execute({
          cpf: '050.523.573-09',
          name: 'huehuebrbr',
          movement: { value: 20 },
        }),
      ).rejects.toThrow('CONFLICT');
    });

    it('Quando tentar criar uma conta com NOME VAZIO, retornar erro.', async () => {
      await expect(
        createAccountUseCase.execute({
          cpf: '050.523.573-03',
          name: '',
          movement: { value: 20 },
        }),
      ).rejects.toThrow('name invalido.');
    });
  });

  describe('Account balance', () => {
    let accountBalanceUseCase: AccountBalanceUseCase;
    beforeEach(() => {
      accountBalanceUseCase = new AccountBalanceUseCase(mockAccountRepo);
    });
    it('Quando tentar obter o saldo da conta com id valido, deve esperar sucesso.', async () => {
      await expect(
        accountBalanceUseCase.execute('15721aad-d250-42ed-8e49-5bb42baaa2dd'),
      ).resolves.toHaveProperty('id');
    });

    it('Quando tentar obter o saldo da conta com id NULO, deve esperar erro', async () => {
      await expect(accountBalanceUseCase.execute(null)).rejects.toThrow();
    });

    it('Quando tentar obter o saldo da conta com id que nao existe, deve informar NOT_FOUND.', async () => {
      await expect(
        accountBalanceUseCase.execute('15721aad-d250-42ed-8e49-5bb42baaa2'),
      ).rejects.toThrow('NOT_FOUND');
    });
  });

  describe('Account credit', () => {
    let accountCreditUseCase: AccountCreditUseCase;
    beforeEach(() => {
      accountCreditUseCase = new AccountCreditUseCase(mockAccountRepo);
    });
    it('Quando tentar adicionar creditos a conta com dados VALIDOS, deve esperar sucesso.', async () => {
      await expect(
        accountCreditUseCase.execute({
          accountId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
          value: 20,
        }),
      ).resolves.toHaveProperty('id');
    });

    it('Quando tentar adicionar creditos a conta com valor NULO, deve esperar erro', async () => {
      await expect(
        accountCreditUseCase.execute({
          accountId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
          value: null,
        }),
      ).rejects.toThrow();
    });

    it('Quando tentar adicionar creditos a conta id que nao existe, deve informar NOT_FOUND.', async () => {
      await expect(
        accountCreditUseCase.execute({
          accountId: '15721aad-d250-42ed-8e49-5bb42baaa2',
          value: 20,
        }),
      ).rejects.toThrow('NOT_FOUND');
    });
  });

  describe('Account debit', () => {
    let accountDebitUseCase: AccountDebitUseCase;
    beforeEach(() => {
      accountDebitUseCase = new AccountDebitUseCase(mockAccountRepo);
    });
    it('Quando tentar debitar creditos da conta com dados VALIDOS, deve esperar sucesso.', async () => {
      await expect(
        accountDebitUseCase.execute({
          accountId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
          value: 20,
        }),
      ).resolves.toHaveProperty('id');
    });

    it('Quando tentar debitar creditos da conta com valor NULO, deve esperar erro', async () => {
      await expect(
        accountDebitUseCase.execute({
          accountId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
          value: null,
        }),
      ).rejects.toThrow();
    });

    it('Quando tentar debitar creditos da conta id que nao existe, deve informar NOT_FOUND.', async () => {
      await expect(
        accountDebitUseCase.execute({
          accountId: '15721aad-d250-42ed-8e49-5bb42baaa2',
          value: 20,
        }),
      ).rejects.toThrow('NOT_FOUND');
    });
  });

  describe('Account transfer', () => {
    let useCase: AccountTransferUseCase;
    beforeEach(() => {
      useCase = new AccountTransferUseCase(mockAccountRepo);
    });
    it('Quando tentar transferir valores entre contas com dados VALIDOS, deve esperar sucesso.', async () => {
      await expect(
        useCase.execute({
          value: 20,
          accountDestinyId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
          accountOriginId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
        }),
      ).resolves.toBe(true);
    });

    it('Quando tentar transferir valores entre contas, mas a conta de DESTINO INEXISTENTE, deve esperar erro', async () => {
      await expect(
        useCase.execute({
          value: 20,
          accountDestinyId: '15721aad-d250-42ed-8e49-5bb42baaa2',
          accountOriginId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
        }),
      ).rejects.toThrow();
    });

    it('Quando tentar transferir valores entre contas, mas a conta de ORIGEM INEXISTENTE, deve esperar erro.', async () => {
      await expect(
        useCase.execute({
          value: 20,
          accountDestinyId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
          accountOriginId: '15721aad-d250-42ed-8e49-5bb42baaa2',
        }),
      ).rejects.toThrow();
    });

    it('Quando tentar transferir valores entre contas, mas com o valor a ser debitado maior do que existe no saldo de origem, deve esperar erro.', async () => {
      await expect(
        useCase.execute({
          value: 999,
          accountDestinyId: '15721aad-d250-42ed-8e49-5bb42baaa2dd',
          accountOriginId: '15721aad-d250-42ed-8e49-5bb42baaa2',
        }),
      ).rejects.toThrow();
    });
  });
});
