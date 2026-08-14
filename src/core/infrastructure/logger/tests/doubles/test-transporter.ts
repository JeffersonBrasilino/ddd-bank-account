import { Transporter } from "../../domain/transporter.interface";
import { LogRecord } from "../../domain/log-record";

export class TestTransporter implements Transporter {
  public readonly logs: LogRecord[] = [];

  private shouldError = false;

  public log(record: LogRecord): void {
    if (this.shouldError) {
      throw new Error("TestTransporter forced error");
    }

    this.logs.push(record);
  }

  public getLatest(): LogRecord | undefined {
    return this.logs[this.logs.length - 1];
  }

  public clean(): void {
    this.logs.length = 0;
    this.shouldError = false;
  }

  public forcingError(): void {
    this.shouldError = true;
  }
}
