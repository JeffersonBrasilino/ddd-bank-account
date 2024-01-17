import { Entity, EntityProps } from '@core/domain/entity';
import { PersonContactEntity } from './person-contact.entity';
import { CpflValueObject } from './person-cpf.value-object';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export type PersonEntitytProps = {
  id?: number | string;
  contacts?: PersonContactEntity[];
  cpf?: CpflValueObject;
  name?: string;
  birthDate?: Date;
} & EntityProps;
export class PersonEntity extends Entity {
  private constructor(
    uuid: string,
    private id?: number | string,
    private contacts?: PersonContactEntity[],
    private cpf?: CpflValueObject,
    private name?: string,
    private birthDate?: Date,
  ) {
    super(uuid);
  }

  static create(props: PersonEntitytProps): PersonEntity | AbstractError<any> {
    return new PersonEntity(
      props.uuid,
      props.id,
      props.contacts,
      props.cpf,
      props.name,
      props.birthDate,
    );
  }
  getId(): number | string {
    return this.id;
  }

  getContacts(): PersonContactEntity[] {
    return this.contacts;
  }

  getCpf(): CpflValueObject {
    return this.cpf;
  }

  getName(): string {
    return this.name;
  }

  getBirthDate(): Date {
    return this.birthDate;
  }
}
