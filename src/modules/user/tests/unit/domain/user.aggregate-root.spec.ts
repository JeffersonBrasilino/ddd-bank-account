import {
  AbstractError,
  NotFoundError,
  ValidationError,
} from '@core/domain/errors';
import { PasswordValueObject } from '@module/user/domain/password.value-object';
import { PersonEntity } from '@module/user/domain/person/person.entity';
import { UserDevicesEntity } from '@module/user/domain/user-devices.entity';
import {
  UserAggregateRoot,
  UserAggregateRootProps,
} from '@module/user/domain/user.aggregate-root';

describe('UserAggregateRoot', () => {
  let sut: UserAggregateRoot;
  beforeEach(() => {
    const rawData: UserAggregateRootProps = {
      id: '1',
      username: 'dummy',
      password: PasswordValueObject.create({
        value: 'Passwors@1',
      }) as PasswordValueObject,
      userGroups: [],
      person: PersonEntity.create({}) as PersonEntity,
      recoveryCode: '1234',
      devices: [
        UserDevicesEntity.create({
          deviceId: '1',
          authToken: '123',
          refreshToken: '456',
        }) as UserDevicesEntity,
      ],
    };
    sut = UserAggregateRoot.create(rawData) as UserAggregateRoot;
  });

  it('should be created successfully', () => {
    expect(sut).toBeInstanceOf(UserAggregateRoot);
  });

  const getMethodsToTest = [
    { method: 'getUsername', toReturn: 'dummy' },
    { method: 'getPassword', toReturnInstance: PasswordValueObject },
    { method: 'getId', toReturn: '1' },
    { method: 'getUserGroups', toReturnInstance: Array },
    { method: 'getPerson', toReturnInstance: PersonEntity },
    { method: 'getRecoveryCode', toReturn: '1234' },
    { method: 'getDevices', toReturnInstance: Array },
  ];
  for (const target of getMethodsToTest) {
    it(`should be ${target.method} method is defined`, () => {
      expect(typeof sut[target.method] == 'function').toEqual(true);
      if (target.toReturn !== undefined)
        expect(sut[target.method]()).toBe(target.toReturn);
      else expect(sut[target.method]()).toBeInstanceOf(target.toReturnInstance);
    });
  }

  it('should be create error with invalid data', () => {
    const sut = UserAggregateRoot.create({
      username: undefined,
      password: PasswordValueObject.create({
        value: 'Passwors@1',
      }) as PasswordValueObject,
    });
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toMatchObject({
      username: ['is required'],
    });
  });

  it('should be setPassword method is defined', () => {
    expect(typeof sut.setPassword == 'function').toEqual(true);
    expect(
      sut.setPassword(
        PasswordValueObject.create({
          value: 'Passwors@1',
        }) as PasswordValueObject,
      ),
    ).toBeInstanceOf(UserAggregateRoot);
  });

  it('should be setRecoveryCode method is defined', () => {
    expect(typeof sut.setRecoveryCode == 'function').toEqual(true);
    expect(sut.setRecoveryCode('1234')).toBeInstanceOf(UserAggregateRoot);
  });

  it('should be getDeviceByDeviceId returns success', () => {
    expect(sut.getDeviceByDeviceId('1')).toBeInstanceOf(UserDevicesEntity);
  });

  it('should be getDeviceByDeviceId returns Error', () => {
    const called = sut.getDeviceByDeviceId('2') as any;
    expect(called).toBeInstanceOf(NotFoundError);
    expect(called.getError()).toBe('device 2 has not found');
  });

  it('should be addDevice returns success', () => {
    expect(
      sut.addDevice(
        UserDevicesEntity.create({
          deviceId: '1',
          authToken: '123',
          refreshToken: '456',
        }) as UserDevicesEntity,
      ),
    ).toBeInstanceOf(UserAggregateRoot);
  });

  it('should be removeDevice returns success', () => {
    expect(sut.removeDevice('1')).toBeInstanceOf(UserAggregateRoot);
  });

  it('should be removeDevice returns Error', () => {
    const called = sut.removeDevice('2') as any;
    expect(called).toBeInstanceOf(NotFoundError);
    expect(called.getError()).toBe('device 2 has not found');
  });

  it('should be disableDevice returns success', () => {
    expect(sut.disableDevice('1')).toBeInstanceOf(UserAggregateRoot);
  });

  it('should be disableDevice returns Error', () => {
    const called = sut.disableDevice('2') as any;
    expect(called).toBeInstanceOf(NotFoundError);
    expect(called.getError()).toBe('device 2 has not found');
  });

  it('should be enableDevice returns success', () => {
    expect(sut.enableDevice('1')).toBeInstanceOf(UserAggregateRoot);
  });

  it('should be enableDevice returns Error', () => {
    const called = sut.enableDevice('2') as any;
    expect(called).toBeInstanceOf(NotFoundError);
    expect(called.getError()).toBe('device 2 has not found');
  });

  it('should be refreshDeviceAuthToken returns success', () => {
    expect(sut.refreshDeviceAuthToken('1', '123')).toBeInstanceOf(
      UserAggregateRoot,
    );
  });

  it('should be refreshDeviceAuthToken returns Error', () => {
    const called = sut.refreshDeviceAuthToken('2', '123') as any;
    expect(called).toBeInstanceOf(NotFoundError);
    expect(called.getError()).toBe('device 2 has not found');
  });

  it('should be refreshDeviceRefreshToken returns success', () => {
    expect(sut.refreshDeviceRefreshToken('1', '123')).toBeInstanceOf(
      UserAggregateRoot,
    );
  });

  it('should be refreshDeviceRefreshToken returns Error', () => {
    const called = sut.refreshDeviceRefreshToken('2', '123') as any;
    expect(called).toBeInstanceOf(NotFoundError);
    expect(called.getError()).toBe('device 2 has not found');
  });
});
