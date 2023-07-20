import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PersonContactsTypeEntity } from './person-contacts-type.entity';
import { PersonEntity } from './person.entity';

@Entity('person_contacts', { schema: 'auth' })
export class PersonContactsEntity extends TypeormBaseEntity {
  @ManyToOne(() => PersonEntity, p => p.id)
  @JoinColumn({ name: 'person_id' })
  person!: PersonEntity;

  @ManyToOne(() => PersonContactsTypeEntity, pct => pct.id)
  @JoinColumn({ name: 'person_contact_type_id' })
  personContactType!: PersonContactsTypeEntity;

  @Column()
  description!: string;

  @Column({
    type: 'char',
    length: 1,
    comment:
      'chave verificadora do contato principal(pode ter somente um por tipo)',
  })
  main: string;
}
