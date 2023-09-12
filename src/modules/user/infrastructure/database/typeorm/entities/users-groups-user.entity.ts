import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersGroupsEntity } from './users-groups.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'users_groups_user', schema: 'auth' })
export class UsersGroupsUserEntity extends TypeormBaseEntity {
  @Column({ default: 0 })
  main!: string;

  @ManyToOne(() => UsersEntity, u => u.id, { orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'user_id' })
  user!: UsersEntity;

  @ManyToOne(() => UsersGroupsEntity, gpu => gpu.id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_group_id' })
  userGroup!: UsersGroupsEntity;
}
