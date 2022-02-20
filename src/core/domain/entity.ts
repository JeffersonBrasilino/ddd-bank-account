import { UniqueEntityId } from './unique-enity-id';
export interface EntityProps {
  id?: string | number;
}
export abstract class Entity {
  private _id;
  public get id() {
    return this._id;
  }
  constructor(id?: string | number) {
    this._id = id ?? UniqueEntityId.create();
  }
}
