import { Entity, EntityProps } from '@core/domain/entity';
import { DomainError } from '@core/domain/errors';
import { PersonContactEntity } from './person-contact.entity';

export type PersonEntitytProps = {
  id?: number | string;
  contacts?: PersonContactEntity[];
} & EntityProps;
export class PersonEntity extends Entity {
  private constructor(
    uuid: string,
    private id?: number | string,
    private contacts?: PersonContactEntity[],
  ) {
    super(uuid);
  }

  static create(props: PersonEntitytProps): PersonEntity | DomainError {
    const validate = PersonEntity.validate(props);
    if (validate != true) return validate as DomainError;
    return new PersonEntity(props.uuid, props.id, props.contacts);
  }
  static validate(props: PersonEntitytProps): DomainError | true {
    const errors = [];

    return errors.length > 0 ? new DomainError(errors) : true;
  }
  getId(): number | string {
    return this.id;
  }

  getContacts(): PersonContactEntity[] {
    return this.contacts;
  }
}
