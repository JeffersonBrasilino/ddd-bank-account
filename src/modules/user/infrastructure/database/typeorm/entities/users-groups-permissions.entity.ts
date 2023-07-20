import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersGroupsEntity } from './users-groups.entity';

@Entity('users_groups_permissions', { schema: 'auth' })
export class UsersGroupsPermissionsEntity extends TypeormBaseEntity {
  //adicione os campos da tabela aqui.
  @ManyToOne(() => UsersGroupsEntity, ug => ug.id)
  @JoinColumn({ name: 'user_group_id' })
  usersGroups!: UsersGroupsEntity;

  @Column({ type: 'int8', name: 'api_route_application_id' })
  apiRouteApplicationId!: number;

  @Column({
    name: 'action',
    comment:
      'acao que o grupo de usuario/aplicacao tem na rota. pode ser GET,POST,PUT,DELETE',
  })
  action!: string;
}
