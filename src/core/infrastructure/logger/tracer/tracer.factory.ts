import { Tracer } from "../domain/tracer.interface";
import { NullTracer } from "./null-tracer";
import { OtelTracer } from "./otel-tracer";

export class TracerFactory {
  public static create(): Tracer {
    if (process.env.ENABLE_OTEL_TRACER !== "true") {
      return new NullTracer();
    }

    return new OtelTracer();
  }
}
