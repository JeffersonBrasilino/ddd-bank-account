import { Entity } from './entity';

export abstract class AgregateRoot extends Entity {
  constructor(uuid?: string | number) {
    super(uuid);
  }
}
