import { IConnectionDriver } from '../connection-drivers/IConnection-driver';
import { IEventSubscriber } from './IEvent-subscriber';

export class EventSubscriber implements IEventSubscriber {
  constructor(private connection: IConnectionDriver, private events: any[]) {}

  subscribeEvents(subject): void {
    this.connection.subscribe(this.events, subject);
  }
}
