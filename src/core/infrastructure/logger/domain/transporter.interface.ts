import { LogRecord } from "./log-record";

export interface Transporter {
  log(record: LogRecord): void;
}
