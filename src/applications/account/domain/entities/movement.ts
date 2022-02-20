import { Entity, EntityProps } from '@core/domain/entity';
export interface MovementProps extends EntityProps {
  value: number;
  createdAt?: Date;
}
export class Movement extends Entity {
  private _value: number;
  private _createdAt: Date;

  public get value(): number {
    return this._value;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  private constructor(props: MovementProps) {
    super(props.id);

    if (Movement.isValid(props.value)) throw Error('valor incorreto.');
    this._value = props.value;
    this._createdAt = props.createdAt ?? new Date();
  }

  static isValid(value: number): boolean {
    return !!(value < 0) || value == null;
  }

  credit(value: number): void {
    if (Movement.isValid(value))
      throw Error('valor a ser creditado nao pode ser negativo');
    this._value = parseFloat((this._value + value).toFixed(2));
  }

  debit(value: number): void {
    if (Movement.isValid(value))
      throw Error('valor a ser debitado nao pode ser negativo');

    const resultDebitOperation = this._value - value;
    if (resultDebitOperation < 0)
      throw Error('o valor a ser debitado ultrapassa o saldo da conta.');

    this._value = parseFloat((this._value - value).toFixed(2));
  }

  static create(props: MovementProps) {
    return new Movement(props);
  }
}
