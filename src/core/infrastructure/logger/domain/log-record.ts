import { LogLevel } from "./log-level";

export interface LogRecord {
  name: string;
  timestamp: number;
  timestampISO: string;
  level: LogLevel;
  message: string;
  metadata: Record<string, unknown>;
  contextMetadata: Record<string, unknown>;
  recordMetadata: Record<string, unknown>;
}
