import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PersonEntity } from './person.entity';
import { UsersGroupsUserEntity } from './users-groups-user.entity';

@Entity({ name: 'users', schema: 'auth' })
export class UsersEntity extends TypeormBaseEntity {
  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @ManyToOne(() => PersonEntity, p => p.id)
  @JoinColumn({ name: 'person_id' })
  person!: PersonEntity;

  @Column({ name: 'verification_code', nullable: true })
  verificationCode!: string;

  @OneToMany(() => UsersGroupsUserEntity, gpuu => gpuu.userGroup)
  usersGroup!: UsersGroupsUserEntity[];
}
