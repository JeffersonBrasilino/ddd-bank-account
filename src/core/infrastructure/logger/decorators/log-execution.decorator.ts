import { LogLevel } from "../domain/log-level";
import { Logger } from "../core/logger";
import { Tracer, Span, SpanStatus } from "../domain/tracer.interface";

interface LogExecutionDecoratorConfig {
  logger: Logger;
  tracer?: Tracer;
  logInputs?: boolean;
  logOutputs?: boolean;
}

function getErrorObject(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      error: {
        message: err.message,
        name: err.name,
        stack: err.stack,
        ...Object.getOwnPropertyNames(err),
      },
    };
  }
  return { error: err };
}

function shouldLogDefaultTrue(config: LogExecutionDecoratorConfig, property: "logInputs" | "logOutputs"): boolean {
  return config[property] !== false;
}

function createLogData(
  config: LogExecutionDecoratorConfig,
  argumentsList: unknown[],
  result?: unknown,
): Record<string, unknown> {
  const logData: Record<string, unknown> = {};

  if (shouldLogDefaultTrue(config, "logInputs")) {
    logData.inputs = argumentsList;
  }

  if (shouldLogDefaultTrue(config, "logOutputs")) {
    logData.outputs = result;
  }

  return logData;
}

function completeSpanSuccess(span: Span): void {
  span.setStatus(SpanStatus.ok);
  span.setAttribute("method.result", "success");
  span.end();
}

function completeSpanError(span: Span, error: unknown): void {
  const errorIsError = error instanceof Error;
  const errorToRecord = errorIsError ? error : new Error(String(error));

  span.recordException(errorToRecord);
  span.setStatus(SpanStatus.error);
  span.setAttributes({
    "method.result": "error",
    "error.type": error instanceof Error ? error.name : typeof error,
    "error.message": errorToRecord.message,
  });
  span.end();
}

function logPromiseExecution(
  config: LogExecutionDecoratorConfig,
  argumentsList: unknown[],
  result: Promise<unknown>,
  span?: Span,
): unknown {
  return result
    .then((res) => {
      const logData = createLogData(config, argumentsList, res);
      config.logger.log(LogLevel.info, "method.end", logData);

      if (span) {
        completeSpanSuccess(span);
      }

      return res;
    })
    .catch((err) => {
      config.logger.error("method.error", getErrorObject(err));

      if (span) {
        completeSpanError(span, err);
      }

      throw err;
    });
}

function logSyncExecution(
  config: LogExecutionDecoratorConfig,
  argumentsList: unknown[],
  result: unknown,
  span?: Span,
): void {
  const logData = createLogData(config, argumentsList, result);
  config.logger.log(LogLevel.info, "method.end", logData);

  if (span) {
    completeSpanSuccess(span);
  }
}

function handleMethodExecution(
  config: LogExecutionDecoratorConfig,
  methodName: string,
  target: (...args: unknown[]) => unknown,
  thisArg: unknown,
  argumentsList: unknown[],
): unknown {
  let span: Span | undefined;

  if (config.tracer) {
    span = config.tracer.startSpan(methodName, {
      "method.name": methodName,
      "method.args.length": argumentsList.length,
    });
  }

  config.logger.log(LogLevel.debug, "method.start", { method: methodName, argsCount: argumentsList.length });

  try {
    const result = target.apply(thisArg, argumentsList);

    if (result instanceof Promise) {
      return logPromiseExecution(config, argumentsList, result, span);
    }

    logSyncExecution(config, argumentsList, result, span);
    return result;
  } catch (err: unknown) {
    const error = getErrorObject(err);
    config.logger.error("method.error", error);

    if (span) {
      completeSpanError(span, err);
    }

    throw err;
  }
}

 
export function LogExecutionDecorator(config: LogExecutionDecoratorConfig) {
  return (
    originalTarget: object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ): void => {
     
    const originalMethod = propertyDescriptor.value;
    const methodName = `${originalTarget.constructor.name}.${propertyKey}`;

     
    propertyDescriptor.value = new Proxy(originalMethod, {
      apply: (target: (...args: unknown[]) => unknown, thisArg: unknown, argumentsList: unknown[]) => {
        config.logger.setContextName(methodName);
        return handleMethodExecution(config, methodName, target, thisArg, argumentsList);
      },
    });
  };
}
