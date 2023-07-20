import { Entity, EntityProps } from '@core/domain/entity';
import { DomainError } from '@core/domain/errors';

export type PersonContactTypeEntitytProps = {
  uuid?: string;
  description?: string;
} & EntityProps;
export class PersonContactTypeEntity extends Entity {
  private constructor(uuid: string, private description?: string) {
    super(uuid);
  }

  static create(
    props: PersonContactTypeEntitytProps,
  ): PersonContactTypeEntity | DomainError {
    const validate = PersonContactTypeEntity.validate(props);
    if (validate != true) return validate as DomainError;
    return new PersonContactTypeEntity(props.uuid, props.description);
  }
  static validate(props: PersonContactTypeEntitytProps): DomainError | true {
    const errors = [];
    return errors.length > 0 ? new DomainError(errors) : true;
  }
  getDescription(): string {
    return this.description;
  }
}
