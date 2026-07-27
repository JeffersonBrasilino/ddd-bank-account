import { Transporter } from "../domain/transporter.interface";
import { LogRecord } from "../domain/log-record";
import { MetadataFilter } from "./metadata-filter";

class NullTransporter implements Transporter {
  public log(_record: LogRecord): void {}
}

export class LogProcessor {
  private static instance: LogProcessor | null = null;

  private metadataFilter = new MetadataFilter([], []);

  private transporter: Transporter = new NullTransporter();

  private constructor() {}

  public static getInstance(): LogProcessor {
    LogProcessor.instance ??= new LogProcessor();
    return LogProcessor.instance;
  }

  public setMetadataBlacklist(keys: string[]): void {
    this.metadataFilter = new MetadataFilter(keys, this.metadataFilter.whitelistedKeys);
  }

  public setMetadataWhitelist(keys: string[]): void {
    this.metadataFilter = new MetadataFilter(this.metadataFilter.blacklistedKeys, keys);
  }

  public useTransporter(transporter: Transporter): void {
    this.transporter = transporter;
  }

  public enqueue(entry: LogRecord): void {
    this.transportLog(entry);
  }

  public async flush(): Promise<void> {}

  private transportLog(logEntry: LogRecord): void {
    try {
      this.transporter.log({
        ...logEntry,
        contextMetadata: this.metadataFilter.filter(logEntry.contextMetadata),
        recordMetadata: this.metadataFilter.filter(logEntry.recordMetadata),
      });
    } catch {}
  }
}
