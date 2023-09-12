import { AggregateRoot } from '@core/domain';
import { EntityProps } from '@core/domain/entity';
import { PasswordValueObject } from './password.value-object';
import { UserGroupsEntity } from './user-groups.entity';
import { PersonEntity } from './person/person.entity';
import { UserDevicesEntity } from './user-devices.entity';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export type UserAggregateRootProps = {
  id?: string | number;
  username?: string;
  password?: PasswordValueObject;
  userGroups?: Array<UserGroupsEntity>;
  person?: PersonEntity;
  recoveryCode?: string;
  devices?: UserDevicesEntity[];
} & EntityProps;
export class UserAggregateRoot extends AggregateRoot {
  private constructor(
    uuid: string,
    private id?: string | number,
    private username?: string,
    private password?: PasswordValueObject,
    private userGroups?: Array<UserGroupsEntity>,
    private person?: PersonEntity,
    private recoveryCode?: string,
    private devices?: UserDevicesEntity[],
  ) {
    super(uuid);
  }

  static create(
    props: UserAggregateRootProps,
  ): UserAggregateRoot | AbstractError<any> {
    return new UserAggregateRoot(
      props.uuid,
      props.id,
      props.username,
      props.password,
      props.userGroups,
      props.person,
      props.recoveryCode,
      props.devices,
    );
  }

  public getUsername(): string {
    return this.username;
  }

  public getPassword(): PasswordValueObject {
    return this.password;
  }

  public setPassword(password: PasswordValueObject): UserAggregateRoot {
    this.password = password;
    return this;
  }

  public getUserGroups(): Array<UserGroupsEntity> {
    return this.userGroups;
  }

  public getId(): string | number {
    return this.id;
  }

  public getPerson(): PersonEntity {
    return this.person;
  }

  public setRecoveryCode(recoveryCode: string): UserAggregateRoot {
    this.recoveryCode = recoveryCode;
    return this;
  }

  public getRecoveryCode(): string {
    return this.recoveryCode;
  }

  public addDevice(device: UserDevicesEntity): UserAggregateRoot {
    if (this.devices == undefined) this.devices = [];
    this.devices.push(device);

    return this;
  }

  public getDevices(): Array<UserDevicesEntity> | undefined {
    return this.devices;
  }

  public getDeviceByDeviceId(
    deviceId: string,
  ): UserDevicesEntity | AbstractError<any> {
    if (this.devices == undefined) this.devices = [];
    const device = this.devices.find(
      addedDevice => addedDevice.getDeviceId() == deviceId,
    );

    if (device == undefined) {
      return ErrorFactory.instance().create(
        'notFound',
        `device ${deviceId} has not found`,
      );
    }

    return device;
  }

  public removeDevice(
    deviceId: string,
  ): UserAggregateRoot | AbstractError<any> {
    const device = this.getDeviceByDeviceId(deviceId);
    if (device instanceof AbstractError) {
      return device;
    }
    delete this.devices[this.devices.indexOf(device)];
    return this;
  }

  public disableDevice(
    deviceId: string,
  ): UserAggregateRoot | AbstractError<any> {
    const device = this.getDeviceByDeviceId(deviceId);
    if (device instanceof AbstractError) {
      return device;
    }
    device.disable();
    return this;
  }

  public enableDevice(
    deviceId: string,
  ): UserAggregateRoot | AbstractError<any> {
    const device = this.getDeviceByDeviceId(deviceId);
    if (device instanceof AbstractError) {
      return device;
    }
    device.enable();
    return this;
  }

  public refreshDeviceAuthToken(
    deviceId: string,
    authToken: string,
  ): UserAggregateRoot | AbstractError<any> {
    const device = this.getDeviceByDeviceId(deviceId);
    if (device instanceof AbstractError) {
      return device;
    }
    device.refreshAuthToken(authToken);
    return this;
  }

  public refreshDeviceRefreshToken(
    deviceId: string,
    refreshToken: string,
  ): UserAggregateRoot | AbstractError<any> {
    const device = this.getDeviceByDeviceId(deviceId);
    if (device instanceof AbstractError) {
      return device;
    }
    device.refreshRefreshToken(refreshToken);
    return this;
  }
}
