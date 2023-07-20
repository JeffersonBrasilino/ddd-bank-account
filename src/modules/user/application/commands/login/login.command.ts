export type LoginCommandProps = {
  username: string;
  password: string;
};

export class LoginCommand {
  readonly username: string;
  readonly password: string;
  constructor(props: LoginCommandProps) {
    Object.assign(this, props);
  }
}
