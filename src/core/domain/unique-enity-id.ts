import { v4 as uuidv4 } from 'uuid';
export class UniqueEntityId {
  static create() {
    return uuidv4();
  }
}
