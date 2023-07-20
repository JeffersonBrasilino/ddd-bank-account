import { DomainEvent } from './domain-event';
import { Entity } from './entity';
/**
 * Classe reveladora de intenção da raiz agregada.
 * TODO: desenvolver os eventos de dominio e acrescentar os metodos aqui.
 */
export abstract class AggregateRoot extends Entity {
  private readonly domainEvents: DomainEvent[] = [];

  protected addEvent(event: unknown) {
    this.domainEvents.push(event as DomainEvent);
  }

  public clearEvents() {
    this.domainEvents.length = 0;
  }

  public getEvents(): DomainEvent[] {
    return this.domainEvents;
  }
}
