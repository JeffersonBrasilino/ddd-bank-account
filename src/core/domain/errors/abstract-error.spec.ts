import { AbstractError } from './abstract-error';

class ConcreteError extends AbstractError<string> {
  constructor(message: string, code?: string) {
    super(message, code);
  }
}

describe('AbstractError', () => {
  describe('getCode()', () => {
    it('returns string when code is provided', () => {
      const error = new ConcreteError('msg', 'ERR_001');
      expect(error.getCode()).toBe('ERR_001');
    });

    it('returns undefined when no code is provided', () => {
      const error = new ConcreteError('msg');
      expect(error.getCode()).toBeUndefined();
    });
  });

  describe('getCodeAsString()', () => {
    it('returns empty string when code is undefined', () => {
      const error = new ConcreteError('msg');
      expect(error.getCodeAsString()).toBe('');
    });

    it('returns string representation when code is provided', () => {
      const error = new ConcreteError('msg', 'MY_CODE');
      expect(error.getCodeAsString()).toBe('MY_CODE');
    });
  });

  describe('getError()', () => {
    it('returns the original error message', () => {
      const error = new ConcreteError('something went wrong');
      expect(error.getError()).toBe('something went wrong');
    });
  });

  describe('getPreviousError()', () => {
    it('returns undefined when no previous error', () => {
      const error = new ConcreteError('msg');
      expect(error.getPreviousError()).toBeUndefined();
    });
  });
});
