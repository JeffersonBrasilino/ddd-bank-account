import { AbstractError, ValidationError } from '@core/domain/errors';
import { EmailValueObject } from '@module/user/domain/email.value-object';
describe('EmailValueObject', () => {
  let sut: EmailValueObject;
  beforeEach(() => {
    sut = EmailValueObject.create('test@test.com') as EmailValueObject;
  });

  it('should be created successfully', () => {
    expect(sut).toBeInstanceOf(EmailValueObject);
  });

  it('should be create error with invalid data', () => {
    const sut = EmailValueObject.create('invalid') as any;
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toEqual({
      value: ['is not valid to RegexValidator'],
    });
  });

  const getMethodsToTest = [{ method: 'getValue', toReturn: 'test@test.com' }];
  for (const target of getMethodsToTest) {
    it(`should be ${target.method} method is defined`, () => {
      expect(typeof sut[target.method] == 'function').toEqual(true);
      expect(sut[target.method]()).toBe(target.toReturn);
    });
  }
});
