import { DataNotFoundError } from '@core/infrastructure/errors';
import { InfrastructureError } from '@core/infrastructure/errors/infrastructure.error';
import { UserRepositoryInterface } from '@module/user/domain/contracts/user-repository.interface';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserMapper } from '@module/user/mapper/user.mapper';
import { UsersEntity } from '../typeorm/entities/users.entity';
import { TypeormBaseRepository } from '@core/infrastructure/database/typeorm/typeorm-base.repository';

export class UserRepository implements UserRepositoryInterface {
  private baseRepo: TypeormBaseRepository<UsersEntity>;
  constructor(private mapper: UserMapper) {
    this.baseRepo = new TypeormBaseRepository(UsersEntity);
  }

  async saveRecoveryPasswordCode(
    user: UserAggregateRoot,
  ): Promise<boolean | InfrastructureError> {
    try {
      const userDb = await UsersEntity.findOneBy({ uuid: user.getUuid() });
      if (userDb === null)
        return new DataNotFoundError('usuario nao encontrado');
      userDb.verificationCode = user.getRecoveryCode();
      this.baseRepo.upsert(userDb);
      return true;
    } catch (e) {
      return new InfrastructureError(e.toString());
    }
  }

  async findUserRecoveryPassword(
    username: string,
  ): Promise<UserAggregateRoot | InfrastructureError> {
    try {
      const userData = await UsersEntity.createQueryBuilder('users')
        .innerJoinAndSelect('users.person', 'person', "person.status = '1'")
        .innerJoinAndSelect(
          'person.contacts',
          'contacts',
          "contacts.status = '1' AND contacts.person_contact_type_id = '1'  AND contacts.main = '1' ",
        )
        .andWhere('users.username = :username OR users.password = :username', {
          username,
        })
        .getOne();
      return userData != null
        ? this.mapper.toDomain(userData)
        : new DataNotFoundError('usuario nao encontrado');
    } catch (e) {
      return new InfrastructureError(e.toString());
    }
  }

  async getUserLogin(
    username: string,
  ): Promise<UserAggregateRoot | InfrastructureError> {
    try {
      const userData = await UsersEntity.createQueryBuilder('user')
        .select([
          'user.id',
          'user.uuid',
          'user.username',
          'user.password',
          'ugu.id',
          'ugu.uuid',
          'ugu.main',
          'ug.id',
          'ug.uuid',
        ])
        .leftJoin('user.usersGroup', 'ugu', "ugu.status = '1' ")
        .leftJoin('ugu.userGroup', 'ug', "ug.status = '1'")
        .where('user.username = :username', { username })
        .getOne();
      return userData != null
        ? this.mapper.toDomain(userData)
        : new DataNotFoundError('usuario nao encontrado');
    } catch (e) {
      return new InfrastructureError(e.toString());
    }
  }

  async getUserCheckUserRecoveryPassword(
    uuid: string,
    verificationCode: string,
  ): Promise<UserAggregateRoot | InfrastructureError> {
    try {
      const userData = await UsersEntity.findOneBy({
        uuid,
        verificationCode,
      });
      return userData != null
        ? this.mapper.toDomain(userData)
        : new DataNotFoundError('Código de verifiação ou usuário incorreto.');
    } catch (e) {
      return new InfrastructureError(e.toString());
    }
  }

  //TODO: add this function to base repo
  async save(user: UserAggregateRoot): Promise<boolean | InfrastructureError> {
    try {
      //const userDb = UsersEntity.save;
      const userDb = await UsersEntity.findOneBy({ uuid: user.getUuid() });
      if (userDb === null)
        return new DataNotFoundError('usuario nao encontrado');

      Object.assign(userDb, this.mapper.toPersistence(user));
      await userDb.save();
      return true;
    } catch (e) {
      return new InfrastructureError(e.toString());
    }
  }
}
