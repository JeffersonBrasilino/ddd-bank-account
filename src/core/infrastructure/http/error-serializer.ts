export type ErrorDetail = { field: string; message: string };

export type SerializedError = {
  message: string;
  code: string;
  details: ErrorDetail[] | null;
};

export const ERROR_FALLBACK: SerializedError = {
  message: 'Internal server error',
  code: 'INTERNAL_SERVER_ERROR',
  details: null,
};

function normalizeCode(code: string): string {
  return code
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toUpperCase();
}

function isFieldDetail(value: any): boolean {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'message' in value
  );
}

function shapeFromArray(value: any[]): {
  message: string;
  details?: ErrorDetail[];
} {
  if (value.length > 0 && value.every(isFieldDetail)) {
    const details = value.map(item => ({
      field: String(item.field ?? ''),
      message: String(item.message),
    }));
    return { details, message: details.map(d => d.message).join(', ') };
  }
  return { message: value.map(item => String(item)).join(', ') };
}

function shapeFromObject(value: Record<string, any>): {
  message?: string;
  code?: string;
  details?: ErrorDetail[];
} {
  if (typeof value.message === 'string') {
    const details = Array.isArray(value.details) ? value.details : undefined;
    return { message: value.message, code: value.code, details };
  }

  const details: ErrorDetail[] = Object.entries(value).map(([field, raw]) => ({
    field,
    message: Array.isArray(raw) ? raw.map(String).join(', ') : String(raw),
  }));

  return {
    details,
    message: details.map(d => d.message).join(', '),
  };
}

function shapePayload(payload: any): {
  message: string;
  code?: string;
  details?: ErrorDetail[];
} {
  if (payload === null || payload === undefined) {
    return { message: ERROR_FALLBACK.message };
  }
  if (typeof payload === 'string') {
    return { message: payload };
  }
  if (Array.isArray(payload)) {
    return shapeFromArray(payload);
  }
  if (typeof payload === 'object') {
    const shaped = shapeFromObject(payload);
    return { message: shaped.message ?? ERROR_FALLBACK.message, ...shaped };
  }
  return { message: String(payload) };
}

function extractCode(error: any): string | undefined {
  if (
    error &&
    typeof error === 'object' &&
    typeof error.getCodeAsString === 'function'
  ) {
    const code = error.getCodeAsString();
    if (code) return code;
  }
  return undefined;
}

export function serializeError(error: any): SerializedError {
  if (error === null || error === undefined) {
    return { ...ERROR_FALLBACK };
  }

  const code = extractCode(error);

  const payload =
    error && typeof error.getError === 'function' ? error.getError() : error;

  const shaped = shapePayload(payload);

  const resolvedCode = code ?? shaped.code ?? ERROR_FALLBACK.code;

  return {
    message: shaped.message || ERROR_FALLBACK.message,
    code: normalizeCode(resolvedCode),
    details: shaped.details === undefined ? null : shaped.details,
  };
}
