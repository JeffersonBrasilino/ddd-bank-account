import {
  configProps,
  ConnectionDriversFactory,
  connectionDriversKind,
} from '../event-sourcing/connection-drivers/connection-drivers.factory';
import { EventPublisher } from '../event-sourcing/publisher/event-publisher';
import { IEventPublisher } from '../event-sourcing/publisher/IEvent-publisher';
import { EventSubscriber } from '../event-sourcing/subscriber/event-subscriber';
import { IEventSubscriber } from '../event-sourcing/subscriber/IEvent-subscriber';

export class EventSourcingFactoryProvider {
  static createPublisher(connectionType: connectionDriversKind, config: configProps): IEventPublisher {
    const connection = ConnectionDriversFactory.create(connectionType, config);
    return new EventPublisher(connection);
  }

  static createSubscriber(connectionType: connectionDriversKind, config: configProps, events: any[]): IEventSubscriber {
    const connection = ConnectionDriversFactory.create(connectionType, config);
    return new EventSubscriber(connection, events);
  }
}
