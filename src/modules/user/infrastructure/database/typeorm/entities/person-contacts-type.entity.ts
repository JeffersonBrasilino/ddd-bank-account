import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PersonContactsEntity } from './person-contacts.entity';

@Entity('person_contacts_type', { schema: 'auth' })
export class PersonContactsTypeEntity extends TypeormBaseEntity {
  @OneToMany(() => PersonContactsEntity, pc => pc.personContactType)
  contacts!: PersonContactsEntity[];

  @Column({ comment: 'nome do tipo de contato' })
  description!: string;
}
