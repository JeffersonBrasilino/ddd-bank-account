import { Entity, EntityProps } from '@core/domain/entity';
import { DomainError } from '@core/domain/errors';

export type PersonContactEntitytProps = {
  uuid?: string;
  description?: string;
  contactType?: PersonContactEntity;
  main?: boolean;
} & EntityProps;
export class PersonContactEntity extends Entity {
  private constructor(
    uuid: string,
    private description?: string,
    private contactiType?: PersonContactEntity,
    private main?: boolean,
  ) {
    super(uuid);
  }

  static create(
    props: PersonContactEntitytProps,
  ): PersonContactEntity | DomainError {
    const validate = PersonContactEntity.validate(props);
    if (validate != true) return validate as DomainError;
    return new PersonContactEntity(
      props.uuid,
      props.description,
      props.contactType,
      props.main,
    );
  }
  static validate(props: PersonContactEntitytProps): DomainError | true {
    const errors = [];
    return errors.length > 0 ? new DomainError(errors) : true;
  }
  getDescription(): string {
    return this.description;
  }

  getContactType(): Partial<any> {
    return this.contactiType;
  }

  isMain(): boolean {
    return this.main;
  }
}
