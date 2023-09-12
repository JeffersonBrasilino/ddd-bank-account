import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PersonContactsEntity } from './person-contacts.entity';
import { UsersEntity } from './users.entity';

@Entity('person', { schema: 'auth' })
export class PersonEntity extends TypeormBaseEntity {
  @OneToMany(() => PersonContactsEntity, pc => pc.person, {
    cascade: ['insert'],
  })
  contacts!: PersonContactsEntity[];

  @OneToMany(() => UsersEntity, u => u.person)
  users!: UsersEntity[];

  @Column({ type: 'varchar', nullable: true })
  name!: string;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate!: Date;

  @Column({ type: 'varchar', nullable: true })
  cpf!: string;
}
