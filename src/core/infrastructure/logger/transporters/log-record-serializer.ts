import { LogRecord } from "../domain/log-record";

export function serializeLogRecord(record: LogRecord): string {
  return JSON.stringify({
    ...record.metadata,
    ...record.contextMetadata,
    name: record.name,
    level: record.level,
    message: record.message,
    severity: record.level,
    timestamp: record.timestamp,
    timestampISO: record.timestampISO,
    meta: {
      [record.name]: record.recordMetadata,
    },
  });
}
