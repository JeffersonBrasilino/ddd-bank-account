import { Entity, EntityProps } from '@core/domain/entity';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export type UserDevicesEntitytProps = {
  id?: number;
  deviceId?: string;
  deviceName?: string;
  authToken?: string;
  refreshToken?: string;
  status?: string;
} & EntityProps;
export class UserDevicesEntity extends Entity {
  private constructor(
    uuid: string,
    private id?: number,
    private deviceId?: string,
    private deviceName?: string,
    private authToken?: string,
    private refreshToken?: string,
    private status?: string,
  ) {
    super(uuid);
  }

  static create(
    props: UserDevicesEntitytProps,
  ): UserDevicesEntity | AbstractError<any> {
    const validation = UserDevicesEntity.validate(props);
    if (validation != undefined) return validation;

    return new UserDevicesEntity(
      props.uuid,
      props.id,
      props.deviceId,
      props.deviceName,
      props.authToken,
      props.refreshToken,
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
  ): AbstractError<any> | undefined {
    const errors = [];
    if (value.deviceId == undefined || value.deviceId == null)
      errors.push('deviceId has not been defined');

    if (value.authToken == undefined || value.authToken == null)
      errors.push('authToken has not been defined');

    if (value.refreshToken == undefined || value.refreshToken == null)
      errors.push('refreshToken has not been defined');

    return errors.length > 0
      ? ErrorFactory.instance().create('InvalidData', errors)
      : undefined;
  }
}
