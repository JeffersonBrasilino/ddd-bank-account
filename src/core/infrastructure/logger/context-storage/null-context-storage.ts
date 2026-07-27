import { ContextStorage } from "../domain/context-storage.interface";

export class NullContextStorage implements ContextStorage {
  public set(_key: string, _value: unknown): void {}

  public run<T>(fn: () => T): T {
    return fn();
  }

  public get(_key?: string): unknown {
    return undefined;
  }
}
