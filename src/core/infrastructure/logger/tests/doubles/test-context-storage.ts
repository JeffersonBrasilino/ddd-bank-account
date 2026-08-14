import { ContextStorage } from "../../domain/context-storage.interface";

export class TestContextStorage implements ContextStorage {
  public contextFn?: () => unknown;

  public executionCount = 0;

  private storage: Record<string, unknown> = {};

  public get(key: string): unknown {
    return this.storage[key];
  }

  public run<T>(fn: () => T): T {
    this.contextFn = fn;
    this.executionCount++;
    return fn();
  }

  public set(key: string, value?: unknown): void {
    this.storage[key] = value;
  }

  public clean(): void {
    this.storage = {};
  }

  public reset(): void {
    this.clean();
    this.contextFn = undefined;
    this.executionCount = 0;
  }
}
