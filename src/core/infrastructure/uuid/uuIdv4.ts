import { IUuIdInterface } from '@core/domain/contracts';
import { v4, validate } from 'uuid';
export class UuIdV4 implements IUuIdInterface {
  generate(): string {
    return v4();
  }

  isValid(uuid: string): boolean {
    return validate(uuid);
  }
}
