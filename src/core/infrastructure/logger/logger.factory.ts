import { ContextStorageFactory } from './context-storage/context-storage.factory';
import { Logger, LogLevelConfig } from './core/logger';
import { LogExecutionDecorator } from './decorators/log-execution.decorator';
import { LogLevel } from './domain/log-level';
import { TracerFactory } from './tracer/tracer.factory';
import { ConsoleLogTransporter } from './transporters/console-log-transporter';

const DEFAULT_BLACKLIST = [
  'password',
  'token',
  'authorization',
  'Authorization',
  'cpf',
  'cnpj',
  'secret',
  'senha',
  'pin',
  'cvv',
  'key',
  'presignedImageUrl',
  'avatar',
  'document',
  'image',
];

const DEFAULT_WHITELIST: string[] = [];

export class LoggerFactory {
  public static create(contextName: { name: string } | string = ''): Logger {
    Logger.useTransporter(new ConsoleLogTransporter());
    Logger.useContextStorage(ContextStorageFactory.create());

    const blacklist = process.env.LOGGER_BLACKLISTED_KEYS
      ? process.env.LOGGER_BLACKLISTED_KEYS.split(',').map(k => k.trim())
      : DEFAULT_BLACKLIST;

    const whitelist = process.env.LOGGER_WHITELISTED_KEYS
      ? process.env.LOGGER_WHITELISTED_KEYS.split(',').map(k => k.trim())
      : DEFAULT_WHITELIST;

    Logger.setMetadataBlacklist(blacklist);
    Logger.setMetadataWhitelist(whitelist);
    Logger.addMetadata('environment', process.env.NODE_ENV ?? 'development');
    Logger.addMetadata(
      'application',
      process.env.APP_NAME ?? 'ddd-bank-account',
    );
    Logger.setLevel((process.env.LOG_LEVEL as LogLevelConfig) ?? LogLevel.info);

    return Logger.getLogger(contextName);
  }
}

const logDecoratorLogger = LoggerFactory.create();
const logDecoratorTracer = TracerFactory.create();

export function LoggerDecorator(options?: {
  logInputs?: boolean;
  logOutputs?: boolean;
}) {
  if (process.env.ENABLE_LOGGER_DECORATOR === 'false') {
    return (
      _target: unknown,
      _propertyKey: string,
      descriptor: PropertyDescriptor,
    ) => descriptor;
  }

  return LogExecutionDecorator({
    logger: logDecoratorLogger,
    tracer: logDecoratorTracer,
    logInputs: options?.logInputs,
    logOutputs: options?.logOutputs,
  });
}
