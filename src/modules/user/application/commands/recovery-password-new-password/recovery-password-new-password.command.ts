export type RecoveryPasswordNewPasswordCommandProps = {
  userUuId: string;
  verificationCode: string;
  newPassword: string;
};

export class RecoveryPasswordNewPasswordCommand {
  readonly userUuId: string;
  readonly verificationCode: string;
  readonly newPassword: string;
  constructor(props: RecoveryPasswordNewPasswordCommandProps) {
    Object.assign(this, props);
  }
}
