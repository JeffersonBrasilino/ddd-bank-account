export type RecoveryPasswordSendCodeCommandProps = {
  username: string;
};

export class RecoveryPasswordSendCodeCommand {
  readonly username: string;
  constructor(props: RecoveryPasswordSendCodeCommandProps) {
    Object.assign(this, props);
  }
}
