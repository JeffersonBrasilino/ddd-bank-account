import { AgregateRoot } from '@core/domain/agregate-root';
import { EntityProps } from '@core/domain/entity';
import { Movement } from './movement';
import { CpfValueObject } from '../value-objects/cpf.value-object';

export interface AccountProps extends EntityProps {
  cpf: CpfValueObject;
  name: string;
  createdAt?: Date;
  movement?: Movement;
}
export class Account extends AgregateRoot {
  private _cpf: CpfValueObject;
  private _name: string;
  private _createdAt: Date;
  private _movement!: Movement;

  public get movement(): Movement {
    return this._movement;
  }
  public get name(): string {
    return this._name;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get cpf(): string {
    return this._cpf.value;
  }

  private constructor(props: AccountProps) {
    super(props.id);

    if (!props.cpf || props.cpf.value == '') throw Error('cpf invalido.');
    if (!props.name || props.name == '' || props.name.length > 50)
      throw Error('name invalido.');

    this._cpf = props.cpf;
    this._name = props.name;
    this._createdAt = props.createdAt ?? new Date();

    if (props.movement) this._movement = props.movement;
  }

  static create(props: AccountProps): Account {
    return new Account(props);
  }
}
