import { Entity, EntityProps } from '@core/domain/entity';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export type UserGroupsEntitytProps = {
  id?: number;
  name?: string;
  permissions?: Partial<any>;
  main?: boolean;
  userGroupUserId?: number;
} & EntityProps;
export class UserGroupsEntity extends Entity {
  private constructor(
    uuid: string,
    private id?: number,
    private name?: string,
    private permissions?: Partial<any>,
    private main?: boolean,
    private userGroupUserId?: number,
  ) {
    super(uuid);
  }

  static create(
    props: UserGroupsEntitytProps,
  ): UserGroupsEntity | AbstractError<any> {
    const validate = UserGroupsEntity.validate(props);
    if (validate != true) return validate as AbstractError<any>;
    return new UserGroupsEntity(
      props.uuid,
      props.id,
      props.name,
      props.permissions,
      props.main,
      props.userGroupUserId,
    );
  }
  static validate(props: UserGroupsEntitytProps): AbstractError<any> | true {
    const errors = [];
    if (props.name) errors.push('error: name has setted');

    return errors.length > 0
      ? ErrorFactory.instance().create('InvalidData', errors)
      : true;
  }
  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPermissions(): Partial<any> {
    return this.permissions;
  }

  isMain(): boolean {
    return this.main;
  }

  getUserGroupUserId(): number {
    return this.userGroupUserId;
  }
}
