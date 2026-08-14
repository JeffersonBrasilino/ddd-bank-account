import { Entity } from '@core/domain/entity';
import { DomainEvent } from './domain-event';

/**
 * Classe reveladora de intenção da raiz agregada.
 * TODO: desenvolver os eventos de dominio e acrescentar os metodos aqui.
 */
export abstract class AggregateRoot extends Entity {
  private readonly domainEvents: DomainEvent[] = [];

  protected addEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  public clearEvents() {
    this.domainEvents.length = 0;
  }

  public getEvents(): DomainEvent[] {
    return this.domainEvents;
  }
}
