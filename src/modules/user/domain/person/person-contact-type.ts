import { Entity, EntityProps } from '@core/domain/entity';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export type PersonContactTypeEntitytProps = {
  uuid?: string;
  description?: string;
  id?: number;
} & EntityProps;
export class PersonContactTypeEntity extends Entity {
  private constructor(
    uuid: string,
    private id?: number,
    private description?: string,
  ) {
    super(uuid);
  }

  static create(
    props: PersonContactTypeEntitytProps,
  ): PersonContactTypeEntity | AbstractError<any> {
    const validate = PersonContactTypeEntity.validate(props);
    if (validate != true) return validate as AbstractError<any>;
    return new PersonContactTypeEntity(props.uuid, props.id, props.description);
  }
  static validate(
    props: PersonContactTypeEntitytProps,
  ): AbstractError<any> | true {
    const errors = [];
    return errors.length > 0
      ? ErrorFactory.instance().create('InvalidData', errors)
      : true;
  }
  getDescription(): string {
    return this.description;
  }

  getId(): number {
    return this.id;
  }
}
