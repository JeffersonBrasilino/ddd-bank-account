import { IEventListener } from '@core/application/contracts/event-listener.interface';
import { DomainEvent } from '@core/domain/domain-event';

export abstract class BaseEventListener implements IEventListener {
  abstract handle(event: DomainEvent): Promise<void>;
}
