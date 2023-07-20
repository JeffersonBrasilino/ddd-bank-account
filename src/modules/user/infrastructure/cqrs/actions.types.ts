import { LoginCommand } from '@module/user/application/commands/login/login.command';
import { RecoveryPasswordNewPasswordCommand } from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.command';
import { RecoveryPasswordSendCodeCommand } from '@module/user/application/commands/recovery-password-send-code/recovery-password-send-code.command';

export const ACTIONS = {
  login: LoginCommand,
  recoveryPasswordSendCode: RecoveryPasswordSendCodeCommand,
  recoveryPasswordNewPassword: RecoveryPasswordNewPasswordCommand,
};
export type actions = keyof typeof ACTIONS;
