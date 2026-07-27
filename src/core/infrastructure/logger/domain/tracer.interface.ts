export interface Tracer {
  startSpan(name: string, attributes?: Record<string, unknown>): Span;
}

export interface Span {
  setAttribute(key: string, value: unknown): void;
  setAttributes(attributes: Record<string, unknown>): void;
  recordException(error: Error): void;
  setStatus(status: SpanStatus): void;
  end(): void;
}

export enum SpanStatus {
  ok = "OK",
  error = "ERROR",
}
