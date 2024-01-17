import {
  AbstractError,
  ErrorFactory,
  ValidationError,
} from '@core/domain/errors';
import { PersonBuilder } from '@module/user/domain/person/person.builder';
import { PersonEntity } from '@module/user/domain/person/person.entity';
import { UserDevicesEntity } from '@module/user/domain/user-devices.entity';
import { UserGroupsEntity } from '@module/user/domain/user-groups.entity';
import { UserAggregateRoot } from '@module/user/domain/user.aggregate-root';
import { UserBuilder } from '@module/user/domain/user.builder';

jest.mock('@module/user/domain/user-groups.entity');
jest.mock('@module/user/domain/user-devices.entity');
const mockMethods = {
  withId: jest.fn(() => mockMethods),
  withUuId: jest.fn(() => mockMethods),
  withBirthDate: jest.fn(() => mockMethods),
  withName: jest.fn(() => mockMethods),
  withCpf: jest.fn(() => mockMethods),
  withContacts: jest.fn(() => mockMethods),
  build: jest.fn(() => mockMethods),
};
jest.mock('@module/user/domain/person/person.builder', () => {
  return {
    PersonBuilder: jest.fn().mockImplementation(() => {
      return mockMethods;
    }),
  };
});

function sutFactory() {
  return new UserBuilder()
    .withId('1')
    .withUuId('1')
    .withPassword({ value: 'Password@1' })
    .withDevices([{ authToken: '1', refreshToken: '2', deviceId: '1' }])
    .withPerson({} as any)
    .withRecoveryCode('123')
    .withUserGroups([{ main: true, name: 'dummy' }])
    .withUsername('dummy')
    .build();
}

describe('UserBuilder', () => {
  beforeEach(() => {
    (UserGroupsEntity as any).mockClear();
    (UserDevicesEntity as any).mockClear();
    (PersonBuilder as any).mockClear();

    jest.restoreAllMocks();
  });

  it('should be build UserAggregateRoot Successfully', () => {
    jest.spyOn(mockMethods, 'build').mockReturnValue({} as PersonEntity);
    const sut = sutFactory();
    expect(sut).toBeInstanceOf(UserAggregateRoot);
  });

  it('should be build UserAggregateRoot error with invalid person data', () => {
    jest
      .spyOn(mockMethods, 'build')
      .mockReturnValue(ErrorFactory.create('Validation', 'invalid person'));
    const sut = sutFactory();
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toMatchObject({
      person: 'invalid person',
    });
  });

  it('should be build UserAggregateRoot error with invalid UserGroups data', () => {
    jest
      .spyOn(UserGroupsEntity, 'create')
      .mockReturnValue(ErrorFactory.create('Validation', 'invalid user group'));
    const sut = sutFactory();
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toMatchObject({
      'UserGroupsEntity.0': 'invalid user group',
    });
  });

  it('should be called withDevices error', () => {
    jest
      .spyOn(UserDevicesEntity, 'create')
      .mockReturnValue(ErrorFactory.create('Validation', 'invalid device'));
    const sut = sutFactory()
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toMatchObject({
      'UserDevicesEntity.0': 'invalid device',
    });
  });
});
