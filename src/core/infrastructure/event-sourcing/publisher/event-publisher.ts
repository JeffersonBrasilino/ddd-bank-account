import { IEventPublisher } from './IEvent-publisher';
import { IConnectionDriver } from '../connection-drivers/IConnection-driver';

export class EventPublisher implements IEventPublisher {
  constructor(private readonly connection: IConnectionDriver) {}

  publish<T>(event: T) {
    this.publishViaPublisher(event);
  }

  private publishViaPublisher(event) {
    const payload =
      ['string', 'number'].indexOf(typeof event) != -1
        ? JSON.stringify(event)
        : event;
    this.connection.send(event.constructor.name, payload);
  }
}
