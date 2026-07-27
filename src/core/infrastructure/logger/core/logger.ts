import { ContextStorage } from "../domain/context-storage.interface";
import { LogLevel } from "../domain/log-level";
import { LogLevelWeight } from "../domain/log-level-weight";
import { Transporter } from "../domain/transporter.interface";
import { LogProcessor } from "./log-processor";
import { NullContextStorage } from "../context-storage/null-context-storage";

type ClassOrString = string | { name: string };

const defaultContext = "default";

export type LogLevelConfig = LogLevel | "all" | "off";

export class Logger {
  private static readonly metadata: Record<string, unknown> = {};

  private static readonly contextMetadataKeys: string[] = [];

  private static context: ContextStorage = new NullContextStorage();

  private static readonly processor = LogProcessor.getInstance();

  private static level: LogLevelConfig = LogLevel.info;

  public constructor(private contextName: string = defaultContext) {}

  public static getLogger(className: ClassOrString = defaultContext): Logger {
    const logger = new Logger();
    logger.setContextName(className);
    return logger;
  }

  public static setMetadataBlacklist(keys: string[]): void {
    this.processor.setMetadataBlacklist(keys);
  }

  public static setMetadataWhitelist(keys: string[]): void {
    this.processor.setMetadataWhitelist(keys);
  }

  public static setLevel(level: LogLevelConfig): void {
    this.level = level;
  }

  public static useTransporter(transporter: Transporter): void {
    this.processor.useTransporter(transporter);
  }

  public static useContextStorage(storage: ContextStorage): void {
    this.context = storage;
  }

  public static runInContext<T>(fn: () => T): T {
    return this.context.run(fn);
  }

  public static addMetadata(key: string, value: unknown): void {
    this.metadata[key] = value;
  }

  public static addContextMetadata(key: string, value: unknown): void {
    if (!this.contextMetadataKeys.some((x) => x === key)) {
      this.contextMetadataKeys.push(key);
    }

    this.context.set(key, value);
  }

  public static async flush(): Promise<void> {
    await this.processor.flush();
  }

  public setContextName(contextName: ClassOrString): void {
    this.contextName = typeof contextName === "string" ? contextName : contextName.name;
  }

  public info(message: string, metadata: Record<string, unknown> = {}): void {
    this.log(LogLevel.info, message, metadata);
  }

  public warn(message: string, metadata: Record<string, unknown> = {}): void {
    this.log(LogLevel.warn, message, metadata);
  }

  public debug(message: string, metadata: Record<string, unknown> = {}): void {
    this.log(LogLevel.debug, message, metadata);
  }

  public error(message: string, metadata: Record<string, unknown> = {}): void {
    this.log(LogLevel.error, message, metadata);
  }

  public log(level: LogLevel, message: string, metadata: Record<string, unknown> = {}): void {
    if (LogLevelWeight[level] < LogLevelWeight[Logger.level]) return;
    this.enqueueLog(level, message, metadata);
  }

  private enqueueLog(level: LogLevel, message: string, metadata: Record<string, unknown>): void {
    try {
      const date = new Date();
      Logger.processor.enqueue({
        name: this.contextName,
        level,
        timestamp: date.getTime(),
        timestampISO: date.toISOString(),
        message,
        metadata: Logger.metadata,
        contextMetadata: this.getContextMetadata(),
        recordMetadata: metadata,
      });
    } catch {}
  }

  private getContextMetadata(): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};

    Logger.contextMetadataKeys.forEach((key) => {
      const value = Logger.context.get(key);

      if (value !== undefined && value !== null) {
        metadata[key] = value;
      }
    });

    return metadata;
  }
}
