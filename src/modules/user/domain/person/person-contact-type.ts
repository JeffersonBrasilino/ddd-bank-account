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
    return new PersonContactTypeEntity(props.uuid, props.id, props.description);
  }
  getDescription(): string {
    return this.description;
  }

  getId(): number {
    return this.id;
  }
}
