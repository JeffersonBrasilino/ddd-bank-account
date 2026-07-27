import { DomainEvent } from '../../domain/domain-event';

export interface IEventListener {
  handle(event: DomainEvent): Promise<void>;
}
