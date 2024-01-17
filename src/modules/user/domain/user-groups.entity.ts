import { Entity, EntityProps } from '@core/domain/entity';
import { AbstractError } from '@core/domain/errors';

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
    return new UserGroupsEntity(
      props.uuid,
      props.id,
      props.name,
      props.permissions,
      props.main,
      props.userGroupUserId,
    );
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
