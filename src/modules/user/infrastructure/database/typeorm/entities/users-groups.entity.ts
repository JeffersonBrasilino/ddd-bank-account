import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UsersGroupsPermissionsEntity } from './users-groups-permissions.entity';
import { UsersGroupsUserEntity } from './users-groups-user.entity';

@Entity({ name: 'users_groups', schema: 'auth' })
export class UsersGroupsEntity extends TypeormBaseEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @OneToMany(() => UsersGroupsUserEntity, gpuu => gpuu.userGroup)
  users!: UsersGroupsUserEntity[];

  @OneToMany(() => UsersGroupsPermissionsEntity, ugpu => ugpu.usersGroups)
  usersGoupsPermissions!: UsersGroupsPermissionsEntity[];
}
