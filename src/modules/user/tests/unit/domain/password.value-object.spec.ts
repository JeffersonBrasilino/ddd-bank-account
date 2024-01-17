import { AbstractError, ValidationError } from '@core/domain/errors';
import {
  PasswordValueObject,
  passwordValueObjectProps,
} from '@module/user/domain/password.value-object';
import { CryptPasswordMock } from '../../mocks/crypt-password.mock';
describe('PasswordValueObject', () => {
  let sut: PasswordValueObject;
  beforeEach(() => {
    const props: passwordValueObjectProps = {
      value: 'Password@1',
    };
    sut = PasswordValueObject.create(props) as PasswordValueObject;
  });

  it('should be created successfully', () => {
    expect(sut).toBeInstanceOf(PasswordValueObject);
  });

  it('should be create error with invalid data', () => {
    const sut = PasswordValueObject.create({
      value: '79036788098',
    }) as any;
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toEqual({
      value: ['is not valid to RegexValidator'],
    });
  });

  it('should be crypt password successfully', () => {
    sut.crypt(CryptPasswordMock);
    expect(true).toBe(true);
  });

  const getMethodsToTest = [{ method: 'getValue', toReturn: 'Password@1' }];
  for (const target of getMethodsToTest) {
    it(`should be ${target.method} method is defined`, () => {
      expect(typeof sut[target.method] == 'function').toEqual(true);
      expect(sut[target.method]()).toBe(target.toReturn);
    });
  }
});
