import { LogExecutionDecorator } from "../decorators/log-execution.decorator";
import { Logger } from "../core/logger";
import { LogLevel } from "../domain/log-level";
import { Tracer, SpanStatus } from "../domain/tracer.interface";

describe("LogExecutionDecorator", () => {
  const LOG_END = "method.end";
  const LOG_START = "method.start";
  const LOG_ERROR = "method.error";
  const NON_ERROR_EXCEPTION = "Non-Error exception";
  const ERROR_MESSAGE = "Error message";

  const loggerMock: jest.Mocked<Logger> = {
    log: jest.fn(),
    error: jest.fn(),
    setContextName: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  } as unknown as jest.Mocked<Logger>;

  const spanMock = {
    setAttribute: jest.fn(),
    setAttributes: jest.fn(),
    recordException: jest.fn(),
    setStatus: jest.fn(),
    end: jest.fn(),
  };

  const tracerMock = {
    startSpan: jest.fn((_name: string, _attributes?: Record<string, unknown>) => spanMock),
  } as unknown as Tracer & { startSpan: jest.Mock };

  const target = "target" as unknown as object;
  const propertyKey = "propertyKey";
  const methodName = "String.propertyKey";

  beforeEach(() => {
    jest.clearAllMocks();
    tracerMock.startSpan.mockReturnValue(spanMock);
  });

  it("should log entry before execution of a synchronous method", () => {
    const propertyDescriptor = { value: (input: number) => input * 2 };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    propertyDescriptor.value(5);

    expect(loggerMock.log).toHaveBeenNthCalledWith(
      1,
      LogLevel.debug,
      LOG_START,
      expect.objectContaining({ method: methodName, argsCount: 1 }),
    );
  });

  it("should log execution of a synchronous method", () => {
    const propertyDescriptor = { value: (input: number) => input * 2 };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    const result = propertyDescriptor.value(5);

    expect(result).toBe(10);
    expect(loggerMock.log).toHaveBeenCalledWith(
      LogLevel.info,
      LOG_END,
      expect.objectContaining({ inputs: [5], outputs: 10 }),
    );
  });

  it("should log entry before execution of an asynchronous method", async () => {
    const propertyDescriptor = {
      value: async (input: number) => Promise.resolve(input * 3),
    };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    await propertyDescriptor.value(5);

    expect(loggerMock.log).toHaveBeenNthCalledWith(
      1,
      LogLevel.debug,
      LOG_START,
      expect.objectContaining({ method: methodName, argsCount: 1 }),
    );
  });

  it("should log execution of an asynchronous method", async () => {
    const propertyDescriptor = {
      value: async (input: number) => Promise.resolve(input * 3),
    };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    const result = await propertyDescriptor.value(5);

    expect(result).toBe(15);
    expect(loggerMock.log).toHaveBeenCalledWith(
      LogLevel.info,
      LOG_END,
      expect.objectContaining({ inputs: [5], outputs: 15 }),
    );
  });

  it("should handle empty inputs and outputs gracefully", () => {
    const propertyDescriptor = { value: () => undefined };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    const result = propertyDescriptor.value();

    expect(result).toBeUndefined();
    expect(loggerMock.log).toHaveBeenCalledWith(
      LogLevel.info,
      LOG_END,
      expect.objectContaining({ inputs: [], outputs: undefined }),
    );
  });

  it("should handle methods with multiple arguments", () => {
    const propertyDescriptor = { value: (a: number, b: number) => a + b };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    const result = propertyDescriptor.value(3, 7);

    expect(result).toBe(10);
    expect(loggerMock.log).toHaveBeenCalledWith(
      LogLevel.info,
      LOG_END,
      expect.objectContaining({ inputs: [3, 7], outputs: 10 }),
    );
  });

  it("should log entry with argsCount zero when no arguments", () => {
    const propertyDescriptor = { value: () => undefined };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    propertyDescriptor.value();

    expect(loggerMock.log).toHaveBeenNthCalledWith(
      1,
      LogLevel.debug,
      LOG_START,
      expect.objectContaining({ method: methodName, argsCount: 0 }),
    );
  });

  it("should handle non-Error exceptions correctly", () => {
    const propertyDescriptor = {
      value: () => {
        throw new Error(NON_ERROR_EXCEPTION);
      },
    };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    expect(() => propertyDescriptor.value()).toThrow(NON_ERROR_EXCEPTION);
    expect(loggerMock.error).toHaveBeenCalledWith(
      LOG_ERROR,
      expect.objectContaining({ error: expect.objectContaining({ message: NON_ERROR_EXCEPTION }) }),
    );
  });

  it("should log and rethrow when a Promise rejects", async () => {
    const propertyDescriptor = {
      value: async () => {
        throw new Error(ERROR_MESSAGE);
      },
    };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    await expect(propertyDescriptor.value()).rejects.toThrow(ERROR_MESSAGE);
    expect(loggerMock.error).toHaveBeenCalledWith(
      LOG_ERROR,
      expect.objectContaining({ error: expect.objectContaining({ message: ERROR_MESSAGE }) }),
    );
  });

  it("should serialize non-Error exceptions correctly", () => {
    const propertyDescriptor = {
      value: () => {
        throw ERROR_MESSAGE;
      },
    };

    LogExecutionDecorator({ logger: loggerMock })(target, propertyKey, propertyDescriptor);

    expect(() => propertyDescriptor.value()).toThrow(ERROR_MESSAGE);
    expect(loggerMock.error).toHaveBeenCalledWith(LOG_ERROR, expect.objectContaining({ error: ERROR_MESSAGE }));
  });

  describe("with logInputs configuration", () => {
    it("should skip logging inputs when logInputs is false", () => {
      const propertyDescriptor = { value: (input: number) => input * 2 };

      LogExecutionDecorator({ logger: loggerMock, logInputs: false })(target, propertyKey, propertyDescriptor);

      propertyDescriptor.value(5);

      const endCall = loggerMock.log.mock.calls.find(c => c[1] === LOG_END);
      expect(endCall![2]).not.toHaveProperty("inputs");
      expect(endCall![2]).toHaveProperty("outputs", 10);
    });

    it("should log inputs when logInputs is explicitly true", () => {
      const propertyDescriptor = { value: (input: number) => input * 3 };

      LogExecutionDecorator({ logger: loggerMock, logInputs: true })(target, propertyKey, propertyDescriptor);

      propertyDescriptor.value(5);

      expect(loggerMock.log).toHaveBeenCalledWith(
        LogLevel.info,
        LOG_END,
        expect.objectContaining({ inputs: [5], outputs: 15 }),
      );
    });
  });

  describe("with logOutputs configuration", () => {
    it("should skip logging outputs when logOutputs is false", () => {
      const propertyDescriptor = { value: (input: number) => input * 2 };

      LogExecutionDecorator({ logger: loggerMock, logOutputs: false })(target, propertyKey, propertyDescriptor);

      propertyDescriptor.value(5);

      const endCall = loggerMock.log.mock.calls.find(c => c[1] === LOG_END);
      expect(endCall![2]).toHaveProperty("inputs", [5]);
      expect(endCall![2]).not.toHaveProperty("outputs");
    });

    it("should log outputs when logOutputs is explicitly true", () => {
      const propertyDescriptor = { value: (input: number) => input * 3 };

      LogExecutionDecorator({ logger: loggerMock, logOutputs: true })(target, propertyKey, propertyDescriptor);

      propertyDescriptor.value(5);

      expect(loggerMock.log).toHaveBeenCalledWith(
        LogLevel.info,
        LOG_END,
        expect.objectContaining({ inputs: [5], outputs: 15 }),
      );
    });
  });

  describe("with tracer configuration", () => {
    it("should start and complete span for synchronous method execution", () => {
      const propertyDescriptor = { value: (input: number) => input * 2 };

      LogExecutionDecorator({ logger: loggerMock, tracer: tracerMock })(target, propertyKey, propertyDescriptor);

      const result = propertyDescriptor.value(5);

      expect(result).toBe(10);
      expect(tracerMock.startSpan).toHaveBeenCalledWith(
        methodName,
        expect.objectContaining({ "method.name": methodName, "method.args.length": 1 }),
      );
      expect(spanMock.setStatus).toHaveBeenCalledWith(SpanStatus.ok);
      expect(spanMock.setAttribute).toHaveBeenCalledWith("method.result", "success");
      expect(spanMock.end).toHaveBeenCalled();
    });

    it("should start and complete span for asynchronous method execution", async () => {
      const propertyDescriptor = {
        value: async (input: number) => Promise.resolve(input * 3),
      };

      LogExecutionDecorator({ logger: loggerMock, tracer: tracerMock })(target, propertyKey, propertyDescriptor);

      const result = await propertyDescriptor.value(5);

      expect(result).toBe(15);
      expect(spanMock.setStatus).toHaveBeenCalledWith(SpanStatus.ok);
      expect(spanMock.end).toHaveBeenCalled();
    });

    it("should handle span for synchronous method exception", () => {
      const propertyDescriptor = {
        value: () => {
          throw new Error(ERROR_MESSAGE);
        },
      };

      LogExecutionDecorator({ logger: loggerMock, tracer: tracerMock })(target, propertyKey, propertyDescriptor);

      expect(() => propertyDescriptor.value()).toThrow(ERROR_MESSAGE);
      expect(spanMock.recordException).toHaveBeenCalledWith(expect.any(Error));
      expect(spanMock.setStatus).toHaveBeenCalledWith(SpanStatus.error);
      expect(spanMock.end).toHaveBeenCalled();
    });

    it("should handle span for asynchronous method exception", async () => {
      const propertyDescriptor = {
        value: async () => {
          throw new Error(ERROR_MESSAGE);
        },
      };

      LogExecutionDecorator({ logger: loggerMock, tracer: tracerMock })(target, propertyKey, propertyDescriptor);

      await expect(propertyDescriptor.value()).rejects.toThrow(ERROR_MESSAGE);
      expect(spanMock.recordException).toHaveBeenCalledWith(expect.any(Error));
      expect(spanMock.setStatus).toHaveBeenCalledWith(SpanStatus.error);
      expect(spanMock.end).toHaveBeenCalled();
    });

    it("should handle span for non-Error exceptions", () => {
      const propertyDescriptor = {
        value: () => {
            throw ERROR_MESSAGE;
        },
      };

      LogExecutionDecorator({ logger: loggerMock, tracer: tracerMock })(target, propertyKey, propertyDescriptor);

      expect(() => propertyDescriptor.value()).toThrow(ERROR_MESSAGE);
      expect(spanMock.recordException).toHaveBeenCalledWith(expect.any(Error));
      expect(spanMock.setStatus).toHaveBeenCalledWith(SpanStatus.error);
      expect(spanMock.end).toHaveBeenCalled();
    });
  });
});
