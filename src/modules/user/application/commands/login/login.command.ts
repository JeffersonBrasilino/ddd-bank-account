export type LoginCommandProps = {
  username: string;
  password: string;
  deviceId: string;
  deviceName?: string;
};

export class LoginCommand {
  readonly username: string;
  readonly password: string;
  readonly deviceId: string;
  readonly deviceName?: string;
  constructor(props: LoginCommandProps) {
    Object.assign(this, props);
  }
}
