import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PersonEntity } from './person.entity';
import { UsersGroupsUserEntity } from './users-groups-user.entity';
import { UserDevicesEntity } from './user-devices.entity';

@Entity({ name: 'users', schema: 'auth' })
export class UsersEntity extends TypeormBaseEntity {
  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @ManyToOne(() => PersonEntity, p => p.id, { cascade: ['insert'] })
  @JoinColumn({ name: 'person_id' })
  person!: PersonEntity;

  @Column({ name: 'verification_code', nullable: true })
  verificationCode!: string;

  @OneToMany(() => UsersGroupsUserEntity, gpuu => gpuu.user, {
    cascade: ['insert'],
  })
  usersGroup!: UsersGroupsUserEntity[];

  @OneToMany(() => UserDevicesEntity, ud => ud.user, {
    cascade: ['insert', 'update'],
  })
  devices!: UserDevicesEntity[];
}
