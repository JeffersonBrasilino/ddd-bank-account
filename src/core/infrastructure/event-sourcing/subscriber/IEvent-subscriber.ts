import { Subject } from 'rxjs';
export interface IEventSubscriber {
  subscribeEvents<T>(subject: Subject<T>): void;
}
