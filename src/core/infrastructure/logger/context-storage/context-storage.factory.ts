import { ContextStorage } from "../domain/context-storage.interface";
import { AsyncLocalStorageContext } from "./async-local-storage.context";
import { NullContextStorage } from "./null-context-storage";

export class ContextStorageFactory {
  public static create(): ContextStorage {
    if (process.env.NODE_ENV === "test") {
      return new NullContextStorage();
    }

    return new AsyncLocalStorageContext();
  }
}
