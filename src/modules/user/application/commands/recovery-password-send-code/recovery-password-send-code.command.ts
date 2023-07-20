export type RecoveryPasswordSendCodeCommandProps = {
  username: string;
  password: string;
};

export class RecoveryPasswordSendCodeCommand {
  readonly username: string;
  readonly password: string;
  constructor(props: RecoveryPasswordSendCodeCommandProps) {
    Object.assign(this, props);
  }
}
