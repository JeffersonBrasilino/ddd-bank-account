import { AggregateRoot } from '@core/domain';
import { EntityProps } from '@core/domain/entity';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { ValidationError } from '@core/domain/errors/validation.error';
import {
  DomainValidatorFactory,
  domainValidatorSchemaProps,
} from '@core/domain/validator/domain-validator.factory';
import { RequiredValidator } from '@core/domain/validator/required.validator';
import { PasswordValueObject } from './password.value-object';
import { PersonEntity } from './person/person.entity';
import { UserDevicesEntity } from './user-devices.entity';
import { UserGroupsEntity } from './user-groups.entity';
import { InstanceOfValidator } from '@core/domain/validator';

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
    private username: string,
    private password: PasswordValueObject,
    private id?: string | number,
    private userGroups?: Array<UserGroupsEntity>,
    private person?: PersonEntity,
    private recoveryCode?: string,
    private devices: UserDevicesEntity[] = [],
  ) {
    super(uuid);
  }

  static create(
    props: UserAggregateRootProps,
  ): UserAggregateRoot | AbstractError<any> {
    if (props.uuid == undefined) {
      const valid = this.validate(props);
      if (valid instanceof ValidationError) return valid;
    }

    return new UserAggregateRoot(
      props.uuid,
      props.username,
      props.password,
      props.id,
      props.userGroups,
      props.person,
      props.recoveryCode,
      props.devices,
    );
  }

  private static validate(
    data: UserAggregateRootProps,
  ): boolean | ValidationError {
    const validateProps: domainValidatorSchemaProps = {
      username: [new RequiredValidator()],
      /*  password: [
        new RequiredValidator(),
        new InstanceOfValidator(PasswordValueObject),
      ], */
    };
    const validation = DomainValidatorFactory.create(validateProps);
    if (validation.validate(data) == false) {
      return ErrorFactory.create('Validation', validation.getErrors());
    }
    return true;
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
    this.devices.push(device);

    return this;
  }

  public getDevices(): Array<UserDevicesEntity> | undefined {
    return this.devices;
  }

  public getDeviceByDeviceId(
    deviceId: string,
  ): UserDevicesEntity | AbstractError<any> {
    const device = this.devices.find(
      addedDevice => addedDevice.getDeviceId() == deviceId,
    );

    if (device == undefined) {
      return ErrorFactory.create(
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
