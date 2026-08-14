import { Transporter } from "../domain/transporter.interface";
import { LogRecord } from "../domain/log-record";
import { serializeLogRecord } from "./log-record-serializer";

export class ConsoleLogTransporter implements Transporter {
  public log(record: LogRecord): void {
    console[record.level](serializeLogRecord(record));
  }
}
