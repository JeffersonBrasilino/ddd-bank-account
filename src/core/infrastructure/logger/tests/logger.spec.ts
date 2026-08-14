import { Logger, LogLevelConfig } from "../core/logger";
import { LogLevel } from "../domain/log-level";
import { TestTransporter } from "./doubles/test-transporter";
import { TestContextStorage } from "./doubles/test-context-storage";
import { LogProcessor } from "../core/log-processor";

describe("Logger", () => {
  let transporter: TestTransporter;
  let contextStorage: TestContextStorage;

  beforeEach(() => {
    transporter = new TestTransporter();
    contextStorage = new TestContextStorage();

    Logger.useTransporter(transporter);
    Logger.useContextStorage(contextStorage);
    Logger.setLevel(LogLevel.debug);
    Logger.setMetadataBlacklist([]);
    Logger.setMetadataWhitelist([]);
  });

  afterEach(() => {
    transporter.clean();
    contextStorage.reset();
    Logger.setLevel(LogLevel.info);
    Logger.useTransporter(new TestTransporter());
    Logger.useContextStorage(contextStorage);
  });

  describe(".getLogger", () => {
    it("should create a logger with string context", () => {
      const logger = Logger.getLogger("MyService");
      logger.info("test");
      expect(transporter.getLatest()?.name).toBe("MyService");
    });

    it("should create a logger with class context", () => {
      class MyClass {}
      const logger = Logger.getLogger(MyClass);
      logger.info("test");
      expect(transporter.getLatest()?.name).toBe("MyClass");
    });

    it("should default to 'default' context", () => {
      const logger = Logger.getLogger();
      logger.info("test");
      expect(transporter.getLatest()?.name).toBe("default");
    });
  });

  describe(".info / .warn / .debug / .error", () => {
    const logger = Logger.getLogger("test");

    it("should log info level", () => {
      logger.info("info message");
      expect(transporter.getLatest()?.level).toBe(LogLevel.info);
      expect(transporter.getLatest()?.message).toBe("info message");
    });

    it("should log warn level", () => {
      logger.warn("warn message");
      expect(transporter.getLatest()?.level).toBe(LogLevel.warn);
    });

    it("should log debug level", () => {
      Logger.setLevel(LogLevel.debug);
      logger.debug("debug message");
      expect(transporter.getLatest()?.level).toBe(LogLevel.debug);
    });

    it("should log error level", () => {
      logger.error("error message");
      expect(transporter.getLatest()?.level).toBe(LogLevel.error);
    });

    it("should log with provided metadata", () => {
      const meta = { testKey: "testValue" };
      logger.info("test", meta);
      expect(transporter.getLatest()?.recordMetadata).toEqual(meta);
    });

    it("should not log when level is below configured level", () => {
      Logger.setLevel(LogLevel.error);
      logger.info("should not appear");
      expect(transporter.getLatest()).toBeUndefined();
    });
  });

  describe(".setLevel", () => {
    it("should respect info level", () => {
      Logger.setLevel(LogLevel.info);
      const logger = Logger.getLogger();
      logger.debug("should be filtered");
      expect(transporter.getLatest()).toBeUndefined();
      logger.info("should appear");
      expect(transporter.getLatest()?.level).toBe(LogLevel.info);
    });

    it("should respect error level", () => {
      Logger.setLevel(LogLevel.error);
      const logger = Logger.getLogger();
      logger.warn("filtered");
      expect(transporter.getLatest()).toBeUndefined();
      logger.error("appears");
      expect(transporter.getLatest()?.level).toBe(LogLevel.error);
    });

    it("should handle 'all' level", () => {
      Logger.setLevel("all" as LogLevelConfig);
      const logger = Logger.getLogger();
      logger.debug("debug");
      expect(transporter.getLatest()?.level).toBe(LogLevel.debug);
    });

    it("should handle 'off' level", () => {
      Logger.setLevel("off" as LogLevelConfig);
      const logger = Logger.getLogger();
      logger.error("should be filtered");
      expect(transporter.getLatest()).toBeUndefined();
    });
  });

  describe(".addMetadata", () => {
    it("should include global metadata in every log", () => {
      Logger.addMetadata("environment", "test");
      const logger = Logger.getLogger();
      logger.info("test");
      expect(transporter.getLatest()?.metadata).toMatchObject({ environment: "test" });
    });
  });

  describe(".addContextMetadata", () => {
    it("should add context metadata", () => {
      const key = "requestId";
      const value = "req-123";
      Logger.addContextMetadata(key, value);
      Logger.getLogger().info("test");
      expect(transporter.getLatest()?.contextMetadata).toMatchObject({ [key]: value });
    });

    it("should reset context metadata when set to undefined", () => {
      const key = "requestId";
      Logger.addContextMetadata(key, "req-123");
      Logger.addContextMetadata(key, undefined);
      Logger.getLogger().info("test");
      const contextMeta = transporter.getLatest()?.contextMetadata;
      expect(contextMeta).not.toHaveProperty(key);
    });
  });

  describe(".runInContext", () => {
    it("should call the context fn", () => {
      let called = false;
      const fn = () => {
        called = true;
      };
      Logger.runInContext(fn);
      expect(called).toBe(true);
      expect(contextStorage.contextFn).toBe(fn);
    });
  });

  describe(".enqueueLog", () => {
    it("should add timestamp and timestampISO", () => {
      Logger.getLogger().info("test");
      const latest = transporter.getLatest();
      expect(typeof latest?.timestamp).toBe("number");
      expect(latest?.timestampISO).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("should handle errors during log creation gracefully", () => {
      const originalEnqueue = (LogProcessor.getInstance() as any).enqueue;

      try {
        (LogProcessor.getInstance() as any).enqueue = () => {
          throw new Error("Forced error");
        };

        const logger = Logger.getLogger();
        expect(() => logger.info("This should not throw")).not.toThrow();
      } finally {
        (LogProcessor.getInstance() as any).enqueue = originalEnqueue;
      }
    });
  });

  describe("Logger constructor", () => {
    it("should use the default context name when not provided", () => {
      const logger = new Logger();
      logger.info("test");
      expect(transporter.getLatest()?.name).toBe("default");
    });

    it("should use the provided context name", () => {
      const logger = new Logger("CustomContext");
      logger.info("test");
      expect(transporter.getLatest()?.name).toBe("CustomContext");
    });
  });

  describe(".flush", () => {
    it("should resolve", async () => {
      await expect(Logger.flush()).resolves.toBeUndefined();
    });
  });
});
