import { ErrorFactory } from '@core/domain/errors';
import { serializeError } from './error-serializer';

describe('serializeError', () => {
  it('serializes string AbstractError into message and code', () => {
    const error = ErrorFactory.create('NotFound', 'user not found');

    const result = serializeError(error);

    expect(result).toEqual({
      message: 'user not found',
      code: 'NOT_FOUND',
      details: null,
    });
  });

  it('uses explicit code when provided', () => {
    const error = ErrorFactory.create(
      'NotFound',
      'user not found',
      'USER_NOT_FOUND',
    );

    const result = serializeError(error);

    expect(result).toEqual({
      message: 'user not found',
      code: 'USER_NOT_FOUND',
      details: null,
    });
  });

  it('normalizes legacy lowercase codes to screaming snake case', () => {
    const error = ErrorFactory.create('Rule', 'Invalid password', 'invalid_password');

    const result = serializeError(error);

    expect(result.code).toBe('INVALID_PASSWORD');
  });

  it('converts field error array into details with summarized message', () => {
    const error = ErrorFactory.create(
      'Rule',
      [{ field: 'platform', message: 'User does not have access' }],
      'UNAUTHORIZED_PLATFORM',
    );

    const result = serializeError(error);

    expect(result.code).toBe('UNAUTHORIZED_PLATFORM');
    expect(result.message).toBe('User does not have access');
    expect(result.details).toEqual([
      { field: 'platform', message: 'User does not have access' },
    ]);
  });

  it('converts validator field map into details', () => {
    const error = ErrorFactory.create('Validation', {
      name: ['name is required'],
      tenantId: ['tenantId is required'],
    });

    const result = serializeError(error);

    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.details).toEqual([
      { field: 'name', message: 'name is required' },
      { field: 'tenantId', message: 'tenantId is required' },
    ]);
  });

  it('returns fallback for null and undefined', () => {
    expect(serializeError(null)).toEqual({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      details: null,
    });
    expect(serializeError(undefined)).toEqual({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      details: null,
    });
  });

  it('keeps already shaped error objects', () => {
    const result = serializeError({
      message: 'invalid value',
      code: 'VALIDATION_ERROR',
      details: [{ field: 'email', message: 'email must be valid' }],
    });

    expect(result).toEqual({
      message: 'invalid value',
      code: 'VALIDATION_ERROR',
      details: [{ field: 'email', message: 'email must be valid' }],
    });
  });

  it('serializes raw string error', () => {
    const result = serializeError('something broke');

    expect(result).toEqual({
      message: 'something broke',
      code: 'INTERNAL_SERVER_ERROR',
      details: null,
    });
  });

  it('joins string array messages', () => {
    const result = serializeError(['first error', 'second error']);

    expect(result.message).toBe('first error, second error');
  });

  it('preserves custom catalog codes for domain-specific errors', () => {
    const insufficient = ErrorFactory.create(
      'Rule',
      'Insufficient funds.',
      'INSUFFICIENT_FUNDS',
    );
    expect(serializeError(insufficient).code).toBe('INSUFFICIENT_FUNDS');

    const account = ErrorFactory.create(
      'NotFound',
      'Account not found.',
      'ACCOUNT_NOT_FOUND',
    );
    expect(serializeError(account).code).toBe('ACCOUNT_NOT_FOUND');

    const holder = ErrorFactory.create(
      'NotFound',
      'Holder not found.',
      'HOLDER_NOT_FOUND',
    );
    expect(serializeError(holder).code).toBe('HOLDER_NOT_FOUND');
  });

  it('normalizes mixed-case legacy codes without explicit catalog mapping', () => {
    const error = ErrorFactory.create(
      'InvalidData',
      'some failure',
      'verificatonCodeInvalid',
    );

    expect(serializeError(error).code).toBe('VERIFICATON_CODE_INVALID');
  });

  it('returns fallback with details null when error is null', () => {
    const result = serializeError(null);

    expect(result).toEqual({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      details: null,
    });
  });

  it('returns details null when object has no details field', () => {
    const result = serializeError({ message: 'x', code: 'Y' });

    expect(result).toEqual({
      message: 'x',
      code: 'Y',
      details: null,
    });
  });

  it('preserves explicit empty details array', () => {
    const result = serializeError({ message: 'x', code: 'Y', details: [] });

    expect(result).toEqual({
      message: 'x',
      code: 'Y',
      details: [],
    });
  });
});
