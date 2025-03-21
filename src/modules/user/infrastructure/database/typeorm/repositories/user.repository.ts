import { LoginRepositoryInterface } from '@module/user/domain/contracts/login.repository.interface';
import { RecoveryPasswordNewPasswordRepositoryInterface } from '@module/user/domain/contracts/recovery-password-new-password.repository.interface';
import { RecoveryPasswordSendCodeRepositoryInterface } from '@module/user/domain/contracts/recovery-password-send-code.repository.interface';
import { RefreshAuthTokenRepositoryInterface } from '@module/user/domain/contracts/refresh-auth-token.repository.interface';
import { UserSaveFirstLoginRepositoryInterface } from '@module/user/domain/contracts/user-save-first-login.repository.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { PersonEntity } from '../entities/person.entity';
import { UsersEntity } from '../entities/users.entity';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { DeepPartial } from 'typeorm';

export class UserRepository
  implements
    RecoveryPasswordSendCodeRepositoryInterface,
    RecoveryPasswordNewPasswordRepositoryInterface,
    LoginRepositoryInterface,
    RefreshAuthTokenRepositoryInterface,
    UserSaveFirstLoginRepositoryInterface
{
  constructor(private mapper: UserMapper) {}
  async exists(cpf: string): Promise<AbstractError<any> | boolean> {
    try {
      const result = await PersonEntity.findOneBy({ cpf });
      return result != null
        ? ErrorFactory.create('AlreadyExists', 'already exists in the database')
        : true;
    } catch (e) {
      return ErrorFactory.create('Internal', 'error creating first login');
    }
  }
  async findUserRecoveryPassword(
    username: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    try {
      const userData = await UsersEntity.createQueryBuilder('users')
        .innerJoinAndSelect('users.person', 'person', "person.status = '1'")
        .innerJoinAndSelect('person.contacts', 'contacts')
        .innerJoinAndSelect('contacts.personContactType', 'contactType')
        .andWhere('users.username = :username OR users.password = :username', {
          username,
        })
        .getOne();
      return userData != null
        ? this.mapper.toDomain({
            ...userData,
            usersGroup: undefined,
            devices: undefined,
          })
        : ErrorFactory.create('notFound', 'usuario nao encontrado');
    } catch (e) {
      return ErrorFactory.create('Internal', e.toString());
    }
  }

  async getUserByUsername(
    username: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    try {
      const userData = await UsersEntity.createQueryBuilder('user')
        .select([
          'user.id',
          'user.uuid',
          'user.username',
          'user.password',
          'ugu.id',
          'ugu.main',
          'ugu.uuid',
          'ug.id',
          'ug.uuid',
          'dev.id',
          'dev.deviceId',
          'dev.uuid',
          'dev.deviceName',
          'dev.authToken',
          'dev.refreshToken',
          'dev.status',
        ])
        .leftJoin('user.usersGroup', 'ugu', "ugu.status = '1' ")
        .leftJoin('ugu.userGroup', 'ug', "ug.status = '1'")
        .leftJoin('user.devices', 'dev')
        .where('user.username = :username', { username })
        .getOne();
      return userData != null
        ? this.mapper.toDomain(userData)
        : ErrorFactory.create('notFound', 'usuario nao encontrado');
    } catch (e) {
      return ErrorFactory.create('Internal', e.toString());
    }
  }

  async getUserCheckUserRecoveryPassword(
    uuid: string,
    verificationCode: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    try {
      const userData = await UsersEntity.findOneBy({
        uuid,
        verificationCode,
      });
      return userData != null
        ? this.mapper.toDomain(userData)
        : ErrorFactory.create(
            'notFound',
            'Código de verifiação ou usuário incorreto.',
          );
    } catch (e) {
      return ErrorFactory.create('Internal', e.toString());
    }
  }

  async save(
    user: UserAggregateRoot,
  ): Promise<boolean | AbstractError<any> | any> {
    try {
      const userDb = await UsersEntity.findOneBy({ uuid: user.getUuid() });
      const dataToSave = this.mapper.toPersistence(user);
      if (userDb === null) {
        await UsersEntity.create(dataToSave as DeepPartial<UsersEntity>).save();
        return true;
      }
      Object.assign(userDb, dataToSave);
      await userDb.save();
      return true;
    } catch (e) {
      return ErrorFactory.create('Internal', e.toString());
    }
  }

  async getByCpf(cpf: string): Promise<boolean | AbstractError<any>> {
    try {
      const result = await PersonEntity.findOneBy({ cpf });
      return result != null
        ? true
        : ErrorFactory.create('notFound', 'usuario nao encontrado');
    } catch (err) {
      return ErrorFactory.create('Internal', 'error while checking permission');
    }
  }

  async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<UserAggregateRoot | AbstractError<any>> {
    try {
      const result = await UsersEntity.createQueryBuilder('user')
        .select([
          'user.id',
          'user.uuid',
          'user.username',
          'user.password',
          'ugu.id',
          'ugu.main',
          'ugu.uuid',
          'ug.id',
          'ug.uuid',
          'dev.id',
          'dev.uuid',
          'dev.deviceId',
          'dev.deviceName',
          'dev.authToken',
          'dev.refreshToken',
          'dev.status',
        ])
        .leftJoin('user.usersGroup', 'ugu', "ugu.status = '1' ")
        .leftJoin('ugu.userGroup', 'ug', "ug.status = '1'")
        .leftJoin('user.devices', 'dev')
        .where('dev.refreshToken = :refreshToken', { refreshToken })
        .getOne();
      return result == null
        ? ErrorFactory.create('notFound', 'refresh token not found')
        : this.mapper.toDomain(result);
    } catch (e) {
      return ErrorFactory.create(
        'Internal',
        'error while checking refresh token',
      );
    }
  }
}
