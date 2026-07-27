import { IEventDispatcher } from '@core/application/contracts/event-dispatcher.interface';
import { IEventListener } from '@core/application/contracts/event-listener.interface';
import { DomainEvent } from '@core/domain/domain-event';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NestEventDispatcher implements IEventDispatcher {
  private readonly logger = new Logger(NestEventDispatcher.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async dispatch(eventName: string, event: DomainEvent): Promise<void> {
    this.logger.log(`Dispatching event: ${eventName}`);

    try {
      await this.eventEmitter.emit(eventName, event);
      this.logger.log(`Event ${eventName} dispatched successfully`);
    } catch (error) {
      this.logger.error(`Error dispatching event ${eventName}:`, error);
      throw error;
    }
  }

  register(eventName: string, handler: IEventListener): void {
    this.eventEmitter.on(eventName, async (event: DomainEvent) => {
      await handler.handle(event);
    });
  }

  unregister(eventName: string, handler: IEventListener): void {
    this.eventEmitter.off(eventName, handler.handle);
  }

  unregisterAll(): void {
    this.eventEmitter.removeAllListeners();
  }
}
