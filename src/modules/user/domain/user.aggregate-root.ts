import { AggregateRoot } from '@core/domain';
import { EntityProps } from '@core/domain/entity';
import { DomainError } from '@core/domain/errors';
import { PasswordValueObject } from './password.value-object';
import { UserGroupsEntity } from './user-groups.entity';
import { PersonEntity } from './person.entity';

export type UserAggregateRootProps = {
  id?: string | number;
  username?: string;
  password?: PasswordValueObject;
  userGroups?: Array<UserGroupsEntity>;
  person?: PersonEntity;
  recoveryCode?: string;
} & EntityProps;
export class UserAggregateRoot extends AggregateRoot {
  private constructor(
    uuid: string,
    private id?: string | number,
    private username?: string,
    private password?: PasswordValueObject,
    private userGroups?: Array<UserGroupsEntity>,
    private person?: PersonEntity,
    private recoveryCode?: string,
  ) {
    super(uuid);
  }

  static create(
    props: UserAggregateRootProps,
  ): UserAggregateRoot | DomainError {
    return new UserAggregateRoot(
      props.uuid,
      props.id,
      props.username,
      props.password,
      props.userGroups,
      props.person,
      props.recoveryCode,
    );
  }

  public getUsername(): string {
    return this.username;
  }

  public getPassword(): PasswordValueObject {
    return this.password;
  }

  public setPassword(password: PasswordValueObject): UserAggregateRoot {
    this.password = password;
    return this;
  }

  public getUserGroups(): Array<UserGroupsEntity> {
    return this.userGroups;
  }

  public getId(): string | number {
    return this.id;
  }

  public getPerson(): PersonEntity {
    return this.person;
  }

  public setRecoveryCode(recoveryCode: string): UserAggregateRoot {
    this.recoveryCode = recoveryCode;
    return this;
  }

  public getRecoveryCode(): string {
    return this.recoveryCode;
  }
}
