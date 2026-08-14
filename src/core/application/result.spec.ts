import { AbstractError } from '@core/domain/errors/abstract-error';
import { ErrorFactory } from '@core/domain/errors/error.factory';
import { Result } from './result';

class StubError extends AbstractError<string> {
  constructor(msg: string) {
    super(msg, 'STUB');
  }
}

describe('Result', () => {
  describe('success()', () => {
    it('isSuccess returns true', () => {
      const result = Result.success('value');
      expect(result.isSuccess()).toBe(true);
    });

    it('isFailure returns false', () => {
      const result = Result.success('value');
      expect(result.isFailure()).toBe(false);
    });

    it('getValue returns provided value', () => {
      const result = Result.success({ id: '123' });
      expect(result.getValue()).toEqual({ id: '123' });
    });

    it('works with no value', () => {
      const result = Result.success();
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBeUndefined();
    });
  });

  describe('failure()', () => {
    it('isFailure returns true', () => {
      const error = new StubError('fail');
      const result = Result.failure(error);
      expect(result.isFailure()).toBe(true);
    });

    it('isSuccess returns false', () => {
      const error = new StubError('fail');
      const result = Result.failure(error);
      expect(result.isSuccess()).toBe(false);
    });

    it('getError returns the AbstractError passed', () => {
      const error = new StubError('something failed');
      const result = Result.failure(error);
      expect(result.getError()).toBe(error);
    });

    it('getError returns AbstractError instance', () => {
      const error = ErrorFactory.create('NotFound', 'not found');
      const result = Result.failure(error);
      expect(result.getError()).toBeInstanceOf(AbstractError);
    });
  });

  describe('combine() removed', () => {
    it('does not expose combine static method', () => {
      expect((Result as any).combine).toBeUndefined();
    });
  });
});
