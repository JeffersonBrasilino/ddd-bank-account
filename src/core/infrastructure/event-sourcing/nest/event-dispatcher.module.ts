import { Module } from '@nestjs/common';
import { NestEventDispatcher } from './event-dispatcher.service';

@Module({
  providers: [NestEventDispatcher],
  exports: [NestEventDispatcher],
})
export class EventDispatcherModule {}
