import { CryptPasswordInterface } from '@module/user/domain/contracts/crypt-password.interface';

export const CryptPasswordMock: jest.Mocked<CryptPasswordInterface> = {
  check: jest.fn((rawPassword: string, hashPassword: string) => {
    return rawPassword === hashPassword;
  }),
  crypt: jest.fn((rawPassword: string) => {
    return 'cryptedPassword';
  }),
};
