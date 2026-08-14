import { IEventListener } from '@core/application/contracts/event-listener.interface';
import { DomainEvent } from '@core/domain/domain-event';

export interface IEventDispatcher {
  dispatch(eventName: string, event: DomainEvent): Promise<void>;
  register(eventName: string, handler: IEventListener): void;
  unregister(eventName: string, handler: IEventListener): void;
  unregisterAll(): void;
}
