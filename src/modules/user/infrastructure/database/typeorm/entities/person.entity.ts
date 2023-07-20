import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Entity, OneToMany } from 'typeorm';
import { PersonContactsEntity } from './person-contacts.entity';
import { UsersEntity } from './users.entity';

@Entity('person', { schema: 'auth' })
export class PersonEntity extends TypeormBaseEntity {
  @OneToMany(() => PersonContactsEntity, pc => pc.person)
  contacts!: PersonContactsEntity[];

  @OneToMany(() => UsersEntity, u => u.person)
  users!: UsersEntity[];
}
