import { Tracer, Span, SpanStatus } from "../domain/tracer.interface";

class NullSpan implements Span {
  public setAttribute(_key: string, _value: unknown): void {}

  public setAttributes(_attributes: Record<string, unknown>): void {}

  public recordException(_error: Error): void {}

  public setStatus(_status: SpanStatus): void {}

  public end(): void {}
}

export class NullTracer implements Tracer {
  public startSpan(_name: string, _attributes?: Record<string, unknown>): Span {
    return new NullSpan();
  }
}
