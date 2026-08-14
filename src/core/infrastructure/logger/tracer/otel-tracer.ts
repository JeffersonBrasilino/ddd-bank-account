import {
  trace,
  SpanStatusCode,
  Span as OtelApiSpan,
  Tracer as OtelApiTracer,
} from "@opentelemetry/api";
import { Tracer, Span, SpanStatus } from "../domain/tracer.interface";

class OtelSpan implements Span {
  public constructor(private readonly span: OtelApiSpan) {}

  public setAttribute(key: string, value: unknown): void {
    this.span.setAttribute(key, value as any);
  }

  public setAttributes(attributes: Record<string, unknown>): void {
    this.span.setAttributes(attributes as any);
  }

  public recordException(error: Error): void {
    this.span.recordException(error);
  }

  public setStatus(status: SpanStatus): void {
    this.span.setStatus({
      code: status === SpanStatus.ok ? SpanStatusCode.OK : SpanStatusCode.ERROR,
    });
  }

  public end(): void {
    this.span.end();
  }
}

export class OtelTracer implements Tracer {
  private readonly tracer: OtelApiTracer;

  public constructor(name: string = process.env.APP_NAME ?? "ddd-bank-account") {
    this.tracer = trace.getTracer(name);
  }

  public startSpan(name: string, attributes?: Record<string, unknown>): Span {
    const span = this.tracer.startSpan(name);

    if (attributes) {
      span.setAttributes(attributes as any);
    }

    return new OtelSpan(span);
  }
}
