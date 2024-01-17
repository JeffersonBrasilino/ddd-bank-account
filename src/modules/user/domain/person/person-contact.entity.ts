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
    return new PersonContactEntity(
      props.uuid,
      props.description,
      props.contactType,
      props.main,
      props.id,
    );
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
