import { ActionHandlerInterface } from './action-handler.interface';

export type actionProps = { [key: string]: any };

export class ActionFactory<Actions> {
  private _actionsMap: Map<Actions, any> = new Map();

  constructor(actions: actionProps) {
    this.register(actions);
  }

  public register(actions: actionProps): void {
    Object.entries(actions).map((action) => {
      this._actionsMap.set(action[0] as Actions, action[1]);
    });
  }

  public exists(action: Actions): boolean {
    return this._actionsMap.has(action);
  }

  public create<TDto>(action: Actions, props?: TDto): ActionHandlerInterface<any> {
    if (!this.exists(action)) {
      throw new Error(`There is no handler for this action ${action}`);
    }

    const actionInstance = this._actionsMap.get(action);

    return !props ? new actionInstance() : new actionInstance(props);
  }

  public getActions() {
    return this._actionsMap.entries();
  }
}
