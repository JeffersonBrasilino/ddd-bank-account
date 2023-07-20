import { Subject } from 'rxjs';
export interface IConnectionDriver {
  send(pattern: string, data: string);
  subscribe(events?, subject?: Subject<any>);
}
