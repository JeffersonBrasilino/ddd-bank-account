import { AbstractError, ValidationError } from '@core/domain/errors';
import {
  UserDevicesEntity,
  UserDevicesEntitytProps,
} from '@module/user/domain/user-devices.entity';
describe('UserDevicesEntity', () => {
  let sut: UserDevicesEntity;
  beforeAll(() => {
    const props: UserDevicesEntitytProps = {
      authToken: '123',
      refreshToken: '456',
      deviceId: '1',
      id: 1,
      deviceName: 'dummy',
      status: '1',
      uuid: 'abc',
    };
    sut = UserDevicesEntity.create(props) as UserDevicesEntity;
  });

  it('should be created successfully', () => {
    expect(sut).toBeInstanceOf(UserDevicesEntity);
  });

  it('should be create error with invalid data', () => {
    const sut = UserDevicesEntity.create({
      authToken: undefined,
      refreshToken: undefined,
      deviceId: undefined,
    }) as any;
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toMatchObject({
      authToken: ['is required'],
      refreshToken: ['is required'],
      deviceId: ['is required'],
    });
  });

  const getMethodsToTest = [
    { method: 'getId', toReturn: 1 },
    { method: 'getDeviceId', toReturn: '1' },
    { method: 'getDeviceName', toReturn: 'dummy' },
    { method: 'getAuthToken', toReturn: '123' },
    { method: 'getRefreshToken', toReturn: '456' },
    { method: 'getStatus', toReturn: '1' },
  ];
  for (const target of getMethodsToTest) {
    it(`should be ${target.method} method is defined`, () => {
      expect(typeof sut[target.method] == 'function').toEqual(true);
      expect(sut[target.method]()).toBe(target.toReturn);
    });
  }
});
