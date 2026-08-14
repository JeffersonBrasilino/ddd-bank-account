import { AsyncLocalStorage } from "async_hooks";

import { ContextStorage } from "../domain/context-storage.interface";

export class AsyncLocalStorageContext implements ContextStorage {
  private readonly storage = new AsyncLocalStorage<Map<string, unknown>>();

  public get(key: string): unknown {
    return this.storage.getStore()?.get(key);
  }

  public run<T>(fn: () => T): T {
    return this.storage.run(new Map(), fn);
  }

  public set(key: string, value: unknown): void {
    this.storage.getStore()?.set(key, value);
  }
}
