import { UuidInterface } from '@core/domain/contracts';
import { v7, validate } from 'uuid';
export class UuIdV7 implements UuidInterface {
  generate(): string {
    return v7();
  }

  isValid(uuid: string): boolean {
    return validate(uuid);
  }
}
