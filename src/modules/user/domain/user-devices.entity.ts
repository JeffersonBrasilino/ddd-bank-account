import { Entity, EntityProps } from '@core/domain/entity';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { RequiredValidator } from '@core/domain/validator';
import {
  DomainValidatorFactory,
  domainValidatorSchemaProps,
} from '@core/domain/validator/domain-validator.factory';

export type UserDevicesEntitytProps = {
  authToken: string;
  refreshToken: string;
  id?: number;
  deviceId?: string;
  deviceName?: string;
  status?: string;
} & EntityProps;
export class UserDevicesEntity extends Entity {
  private constructor(
    uuid: string,
    private authToken: string,
    private refreshToken: string,
    private id?: number,
    private deviceId?: string,
    private deviceName?: string,
    private status?: string,
  ) {
    super(uuid);
  }

  static create(
    props: UserDevicesEntitytProps,
  ): UserDevicesEntity | AbstractError<any> {
    const validation = UserDevicesEntity.validate(props);
    if (validation instanceof AbstractError) return validation;

    return new UserDevicesEntity(
      props.uuid,
      props.authToken,
      props.refreshToken,
      props.id,
      props.deviceId,
      props.deviceName,
      props.status,
    );
  }

  public getId(): number {
    return this.id;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public getDeviceName(): string {
    return this.deviceName;
  }

  public getAuthToken(): string {
    return this.authToken;
  }

  public getRefreshToken(): string {
    return this.refreshToken;
  }

  public getStatus(): string {
    return this.status;
  }

  public enable(): UserDevicesEntity {
    this.status = '1';
    return this;
  }

  public disable(): UserDevicesEntity {
    this.status = '0';
    return this;
  }

  public refreshAuthToken(newAuthToken: string): UserDevicesEntity {
    this.authToken = newAuthToken;
    return this;
  }

  public refreshRefreshToken(newRefreshToken: string): UserDevicesEntity {
    this.refreshToken = newRefreshToken;
    return this;
  }

  private static validate(
    value: UserDevicesEntitytProps,
  ): AbstractError<any> | boolean {
    const validateUnit = new RequiredValidator();
    const validateProps: domainValidatorSchemaProps = {
      authToken: [validateUnit],
      refreshToken: [validateUnit],
      deviceId: [validateUnit],
    };
    const validation = DomainValidatorFactory.create(validateProps);
    if (validation.validate(value) == false) {
      return ErrorFactory.create('Validation', validation.getErrors());
    }

    return true;
  }
}
