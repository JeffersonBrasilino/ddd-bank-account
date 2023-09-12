import { Result } from '@core/application/result';

export interface ActionHandlerInterface<
  Action,
  TResponse = void | Result<any>,
> {
  execute(command: Action): Promise<TResponse> | TResponse;
}
