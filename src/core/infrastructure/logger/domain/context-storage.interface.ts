export interface ContextStorage {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  run<T>(fn: () => T): T;
}
