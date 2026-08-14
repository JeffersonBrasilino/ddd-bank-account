import { LogProcessor } from "../core/log-processor";
import { LogLevel } from "../domain/log-level";
import { LogRecord } from "../domain/log-record";
import { TestTransporter } from "./doubles/test-transporter";

function makeEntry(message: string): LogRecord {
  const date = new Date();
  return {
    name: "test",
    level: LogLevel.info,
    timestamp: date.getTime(),
    timestampISO: date.toISOString(),
    message,
    metadata: {},
    contextMetadata: {},
    recordMetadata: {},
  };
}

describe("LogProcessor", () => {
  let processor: LogProcessor;
  let transporter: TestTransporter;

  beforeEach(() => {
    transporter = new TestTransporter();
    processor = LogProcessor.getInstance();
    processor.useTransporter(transporter);
    transporter.clean();
  });

  afterEach(async () => {
    await processor.flush();
    transporter.clean();
  });

  it("should process logs synchronously", () => {
    const entry = makeEntry("sync");
    processor.enqueue(entry);
    expect(transporter.logs[0].message).toBe("sync");
  });

  it("should flush with no-op and resolve", async () => {
    processor.enqueue(makeEntry("a"));
    await expect(processor.flush()).resolves.toBeUndefined();
  });

  it("should not throw if transporter throws", () => {
    transporter.forcingError();
    expect(() => processor.enqueue(makeEntry("error log"))).not.toThrow();
  });

  it("should preserve log order", () => {
    for (let i = 0; i < 5; i++) {
      processor.enqueue(makeEntry(`log ${i}`));
    }
    for (let i = 0; i < 5; i++) {
      expect(transporter.logs[i].message).toBe(`log ${i}`);
    }
  });

  it("should apply metadata blacklist", () => {
    processor.setMetadataBlacklist(["password"]);
    const entry: LogRecord = {
      ...makeEntry("test"),
      recordMetadata: { password: "secret123456" },
    };
    processor.enqueue(entry);
    expect(transporter.logs[0].recordMetadata["password"]).not.toBe("secret123456");
  });

  it("should apply metadata whitelist", () => {
    processor.setMetadataBlacklist(["pass"]);
    processor.setMetadataWhitelist(["passportId"]);
    const entry: LogRecord = {
      ...makeEntry("test"),
      recordMetadata: { password: "secret123456", passportId: "PASS-001" },
    };
    processor.enqueue(entry);
    expect(transporter.logs[0].recordMetadata["passportId"]).toBe("PASS-001");
  });

  it("should return singleton instance", () => {
    const instance1 = LogProcessor.getInstance();
    const instance2 = LogProcessor.getInstance();
    expect(instance1).toBe(instance2);
  });
});
