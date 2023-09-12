import { Entity, EntityProps } from '@core/domain/entity';
import { PersonContactTypeEntity } from './person-contact-type';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export type PersonContactEntitytProps = {
  uuid?: string;
  description?: string;
  contactType?: PersonContactTypeEntity;
  main?: boolean;
  id?: number;
} & EntityProps;
export class PersonContactEntity extends Entity {
  private constructor(
    uuid: string,
    private description?: string,
    private contactType?: PersonContactTypeEntity,
    private main?: boolean,
    private id?: number,
  ) {
    super(uuid);
  }

  static create(
    props: PersonContactEntitytProps,
  ): PersonContactEntity | AbstractError<any> {
    const validate = PersonContactEntity.validate(props);
    if (validate != true) return validate as AbstractError<any>;
    return new PersonContactEntity(
      props.uuid,
      props.description,
      props.contactType,
      props.main,
      props.id,
    );
  }
  static validate(props: PersonContactEntitytProps): AbstractError<any> | true {
    const errors = [];
    return errors.length > 0
      ? ErrorFactory.instance().create('InvalidData', errors)
      : true;
  }
  getDescription(): string {
    return this.description;
  }

  getContactType(): PersonContactTypeEntity {
    return this.contactType;
  }

  isMain(): boolean {
    return this.main;
  }

  getId(): number {
    return this.id;
  }
}
