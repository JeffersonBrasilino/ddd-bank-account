import { trace, SpanStatusCode } from "@opentelemetry/api";
import { SpanStatus } from "../domain/tracer.interface";
import { NullTracer } from "../tracer/null-tracer";
import { OtelTracer } from "../tracer/otel-tracer";
import { TracerFactory } from "../tracer/tracer.factory";

jest.mock("@opentelemetry/api");

describe("OtelTracer", () => {
  const mockEnd = jest.fn();
  const mockSetAttribute = jest.fn();
  const mockSetAttributes = jest.fn();
  const mockSetStatus = jest.fn();
  const mockRecordException = jest.fn();

  const mockSpan = {
    end: mockEnd,
    setAttribute: mockSetAttribute,
    setAttributes: mockSetAttributes,
    setStatus: mockSetStatus,
    recordException: mockRecordException,
  };

  const mockStartSpan = jest.fn(() => mockSpan);

  beforeEach(() => {
    jest.clearAllMocks();
    (trace.getTracer as jest.Mock).mockReturnValue({ startSpan: mockStartSpan });
    mockStartSpan.mockReturnValue(mockSpan);
  });

  it("starts span with given name", () => {
    const tracer = new OtelTracer();
    tracer.startSpan("my-operation");

    expect(mockStartSpan).toHaveBeenCalledWith("my-operation");
  });

  it("sets attributes on span when provided", () => {
    const tracer = new OtelTracer();
    tracer.startSpan("my-operation", { "method.name": "execute", count: 3 });

    expect(mockSetAttributes).toHaveBeenCalledWith({ "method.name": "execute", count: 3 });
  });

  it("does not call setAttributes when no attributes given", () => {
    const tracer = new OtelTracer();
    tracer.startSpan("my-operation");

    expect(mockSetAttributes).not.toHaveBeenCalled();
  });

  it("setAttribute delegates to otel span", () => {
    const tracer = new OtelTracer();
    const span = tracer.startSpan("op");
    span.setAttribute("key", "value");

    expect(mockSetAttribute).toHaveBeenCalledWith("key", "value");
  });

  it("setAttributes delegates to otel span", () => {
    const tracer = new OtelTracer();
    const span = tracer.startSpan("op");
    span.setAttributes({ a: 1, b: "x" });

    expect(mockSetAttributes).toHaveBeenCalledWith({ a: 1, b: "x" });
  });

  it("recordException delegates to otel span", () => {
    const tracer = new OtelTracer();
    const span = tracer.startSpan("op");
    const error = new Error("boom");
    span.recordException(error);

    expect(mockRecordException).toHaveBeenCalledWith(error);
  });

  it("setStatus maps SpanStatus.ok to SpanStatusCode.OK", () => {
    const tracer = new OtelTracer();
    const span = tracer.startSpan("op");
    span.setStatus(SpanStatus.ok);

    expect(mockSetStatus).toHaveBeenCalledWith({ code: SpanStatusCode.OK });
  });

  it("setStatus maps SpanStatus.error to SpanStatusCode.ERROR", () => {
    const tracer = new OtelTracer();
    const span = tracer.startSpan("op");
    span.setStatus(SpanStatus.error);

    expect(mockSetStatus).toHaveBeenCalledWith({ code: SpanStatusCode.ERROR });
  });

  it("end delegates to otel span", () => {
    const tracer = new OtelTracer();
    const span = tracer.startSpan("op");
    span.end();

    expect(mockEnd).toHaveBeenCalled();
  });
});

describe("NullTracer", () => {
  it("startSpan returns no-op span that never throws", () => {
    const tracer = new NullTracer();
    const span = tracer.startSpan("op", { key: "value" });

    expect(() => {
      span.setAttribute("k", "v");
      span.setAttributes({ a: 1 });
      span.recordException(new Error("e"));
      span.setStatus(SpanStatus.ok);
      span.end();
    }).not.toThrow();
  });
});

describe("TracerFactory", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns NullTracer when ENABLE_OTEL_TRACER is not set", () => {
    process.env = { ...originalEnv, ENABLE_OTEL_TRACER: undefined };
    const tracer = TracerFactory.create();
    expect(tracer).toBeInstanceOf(NullTracer);
  });

  it("returns NullTracer when ENABLE_OTEL_TRACER is 'false'", () => {
    process.env = { ...originalEnv, ENABLE_OTEL_TRACER: "false" };
    const tracer = TracerFactory.create();
    expect(tracer).toBeInstanceOf(NullTracer);
  });

  it("returns OtelTracer when ENABLE_OTEL_TRACER is 'true'", () => {
    process.env = { ...originalEnv, ENABLE_OTEL_TRACER: "true" };
    const tracer = TracerFactory.create();
    expect(tracer).toBeInstanceOf(OtelTracer);
  });
});
