import { AbstractError, ErrorMessageArg } from './abstract-error';
import { ErrorFactory } from './error.factory';
import { ErrorsType } from './errors.type';

describe('ErrorFactory', () => {
  describe('instance()', () => {
    it('returns the same instance on multiple calls (singleton)', () => {
      const first = ErrorFactory.instance();
      const second = ErrorFactory.instance();
      expect(first).toBe(second);
    });

    it('returns an ErrorFactory instance', () => {
      expect(ErrorFactory.instance()).toBeInstanceOf(ErrorFactory);
    });
  });

  describe('create()', () => {
    it('returns AbstractError instance for Validation type', () => {
      const error = ErrorFactory.create('Validation', ['field is required']);
      expect(error).toBeInstanceOf(AbstractError);
    });

    it('returns AbstractError instance for NotFound type', () => {
      const error = ErrorFactory.create('NotFound', 'resource not found');
      expect(error).toBeInstanceOf(AbstractError);
    });

    it('returns AbstractError instance for Internal type', () => {
      const error = ErrorFactory.create('Internal', 'unexpected error');
      expect(error).toBeInstanceOf(AbstractError);
    });
  });

  describe('exists()', () => {
    it('returns true for registered error types', () => {
      expect(ErrorFactory.instance().exists('NotFound')).toBe(true);
      expect(ErrorFactory.instance().exists('Validation')).toBe(true);
    });
  });

  describe('create() overloads', () => {
    it('overload 1: type + errorOrMessage returns AbstractError<ErrorsType>', () => {
      const error: AbstractError<ErrorsType> = ErrorFactory.create(
        'NotFound',
        'msg',
      );
      expect(error).toBeInstanceOf(AbstractError);
    });

    it('overload 1: accepts ErrorMessageArg (string)', () => {
      const arg: ErrorMessageArg = 'hello';
      const error = ErrorFactory.create('NotFound', arg);
      expect(error.getError()).toBe('hello');
    });

    it('overload 1: accepts ErrorMessageArg (string[])', () => {
      const arg: ErrorMessageArg = ['first', 'second'];
      const error = ErrorFactory.create('Validation', arg);
      expect(error.getError()).toEqual(['first', 'second']);
    });

    it('overload 1: accepts ErrorMessageArg (Partial<any>)', () => {
      const arg: ErrorMessageArg = { field: 'value' };
      const error = ErrorFactory.create('Validation', arg);
      expect(error.getError()).toEqual({ field: 'value' });
    });

    it('overload 2: type + errorOrMessage + code', () => {
      const error = ErrorFactory.create(
        'NotFound',
        'user not found',
        'USER_NOT_FOUND',
      );
      expect(error).toBeInstanceOf(AbstractError);
      expect(error.getCode()).toBe('USER_NOT_FOUND');
    });

    it('overload 3: type + errorOrMessage + code + previousError', () => {
      const previous = ErrorFactory.create('Internal', 'previous');
      const error = ErrorFactory.create(
        'Processing',
        'wrapper',
        'WRAP',
        previous,
      );
      expect(error).toBeInstanceOf(AbstractError);
      expect(error.getCode()).toBe('WRAP');
      expect(error.getPreviousError()).toBe(previous);
    });

    it('catch-all: variadic unknown[] accepts ErrorMessageArg', () => {
      const args: unknown[] = ['msg'];
      const error = ErrorFactory.create('NotFound', ...args);
      expect(error).toBeInstanceOf(AbstractError);
    });

    it('returns typed AbstractError<ErrorsType> for every overload', () => {
      const a: AbstractError<ErrorsType> = ErrorFactory.create(
        'Validation',
        'msg',
      );
      const b: AbstractError<ErrorsType> = ErrorFactory.create(
        'NotFound',
        'msg',
        'NF',
      );
      const c: AbstractError<ErrorsType> = ErrorFactory.create(
        'Internal',
        'msg',
        'INT',
        a,
      );
      expect(a).toBeInstanceOf(AbstractError);
      expect(b).toBeInstanceOf(AbstractError);
      expect(c).toBeInstanceOf(AbstractError);
    });

    it('arity 1 (only type) is accepted by catch-all', () => {
      const error = ErrorFactory.create('NotFound');
      expect(error).toBeInstanceOf(AbstractError);
    });
  });
});