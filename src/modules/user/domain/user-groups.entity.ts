import { Entity, EntityProps } from '@core/domain/entity';
import { DomainError } from '@core/domain/errors';

export type UserGroupsEntitytProps = {
  id?: number | string;
  name?: string;
  permissions?: Partial<any>;
  main?: boolean;
} & EntityProps;
export class UserGroupsEntity extends Entity {
  private constructor(
    uuid: string,
    private id?: number | string,
    private name?: string,
    private permissions?: Partial<any>,
    private main?: boolean,
  ) {
    super(uuid);
  }

  static create(props: UserGroupsEntitytProps): UserGroupsEntity | DomainError {
    const validate = UserGroupsEntity.validate(props);
    if (validate != true) return validate as DomainError;
    return new UserGroupsEntity(
      props.uuid,
      props.id,
      props.name,
      props.permissions,
      props.main,
    );
  }
  static validate(props: UserGroupsEntitytProps): DomainError | true {
    const errors = [];
    if (props.name) errors.push('error: name has setted');

    return errors.length > 0 ? new DomainError(errors) : true;
  }
  getId(): number | string {
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
}
