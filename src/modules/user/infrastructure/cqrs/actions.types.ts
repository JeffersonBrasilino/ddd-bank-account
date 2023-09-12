import { LoginCommand } from '@module/user/application/commands/login/login.command';
import { RecoveryPasswordNewPasswordCommand } from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.command';
import { RecoveryPasswordSendCodeCommand } from '@module/user/application/commands/recovery-password-send-code/recovery-password-send-code.command';
import { RefreshAuthTokenCommand } from '@module/user/application/commands/refresh-auth-token/refresh-auth-token.command';
import { UserSaveFirstLoginCommand } from '@module/user/application/commands/user-save-first-login/user-save-first-login.command';
import { UserExistsQuery } from '@module/user/application/queries/user-exists/user-exists.query';

export const ACTIONS = {
  login: LoginCommand,
  recoveryPasswordSendCode: RecoveryPasswordSendCodeCommand,
  recoveryPasswordNewPassword: RecoveryPasswordNewPasswordCommand,
  userExists: UserExistsQuery,
  userSaveFirstLogin: UserSaveFirstLoginCommand,
  refreshAuthToken: RefreshAuthTokenCommand,
};
export type actions = keyof typeof ACTIONS;
