import { UuIdV7 } from '@core/infrastructure/uuid/uuIdv7';

export type EntityProps = {
  uuid?: string;
};
/**
 * classe reveladora de intenção da entidade.
 * toda entidade de domino deve estender essa classe, serve para identificar um domain entity.
 */
export abstract class Entity {
  private _uuid: string;
  constructor(uuid?: string) {
    //TODO: Ajustar para remover dependência da infra e criar via interface UUID.
    this._uuid = uuid ?? new UuIdV7().generate();
  }
  uuid(): string {
    return this._uuid;
  }
}
