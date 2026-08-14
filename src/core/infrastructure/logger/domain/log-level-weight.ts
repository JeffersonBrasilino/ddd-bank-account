import { LogLevel } from "./log-level";

export const LogLevelWeight: Record<string, number> = {
  [LogLevel.debug]: 0,
  [LogLevel.info]: 1,
  [LogLevel.warn]: 2,
  [LogLevel.error]: 3,
  all: -1,
  none: 5,
  off: 5,
};
