import { IAccountRepository } from '@applications/account/domain/contracts/IAccount.repository';
import { Account } from '@applications/account/domain/entities/account';
import { Movement } from '@applications/account/domain/entities/movement';
import { AccountMapper } from '@applications/account/mapper/account.mapper';
import { MovementMapper } from '@applications/account/mapper/movement.mapper';
import { TypeormConnection } from '@infrastructure/database/core/typeorm.connection';
import { Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';

export class AccountRepository implements IAccountRepository {
  private getTypeormEntity(): Repository<AccountEntity> {
    return TypeormConnection.getConnection().getRepository(AccountEntity);
  }

  async save(account: Account): Promise<Account> {
    try {
      const save = await this.getTypeormEntity().save(
        AccountMapper.toPersistence(account),
      );
      return AccountMapper.toDomain(save);
    } catch (e) {
      throw e.toString();
    }
  }

  async getAccountByUuId(id: string | number): Promise<Account> {
    try {
      const data = await this.getTypeormEntity().findOne({
        relations: ['movement'],
        where: { id },
      });
      if (!data) return await null;
      return AccountMapper.toDomain(data);
    } catch (e) {
      throw e.toString();
    }
  }

  async getAccountByCpf(cpf: string): Promise<Account> {
    try {
      const accountData = await this.getTypeormEntity().findOne({
        where: { cpf },
      });
      if (!accountData) return null;
      return AccountMapper.toDomain(accountData);
    } catch (e) {
      console.log(e);
      throw e.toString();
    }
  }
  async getMovementByAccountUuId(
    accoutUuId: string | number,
  ): Promise<Movement[]> {
    try {
      const data = await this.getTypeormEntity().findOne({
        relations: ['movement'],
        where: { id: accoutUuId },
      });
      if (!data && data?.movement.length == 0) return await null;
      return data.movement.map((v) => MovementMapper.toDomain(v));
    } catch (e) {
      throw e.toString();
    }
  }
}
