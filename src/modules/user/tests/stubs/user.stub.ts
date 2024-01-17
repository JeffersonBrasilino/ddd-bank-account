import {
  LoginCommand,
  LoginCommandProps,
} from '@module/user/application/commands/login/login.command';
import { LoginRequestDto } from '@module/user/infrastructure/http/login/login-request.dto';
import { RefreshAuthTokenRequestDto } from '@module/user/infrastructure/http/refresh-auth-token/refresh-auth-token.request.dto';
import {
  RefreshAuthTokenCommand,
  RefreshAuthTokenProps,
} from '@module/user/application/commands/refresh-auth-token/refresh-auth-token.command';
import { UserSaveFirstLoginRequestDto } from '@module/user/infrastructure/http/user-save-first-login/user-save-first-login.request.dto';
import { RecoveryPasswordCheckCodeRequest } from '@module/user/infrastructure/http/dtos/requests/recovery-password-check-code.request';
import { RecoveryPasswordSendCodeRequest } from '@module/user/infrastructure/http/dtos/requests/recovery-password-send-code.request';
import { UserExistsRequestDto } from '@module/user/infrastructure/http/user-exists/user-exists.request.dto';
import {
  RecoveryPasswordNewPasswordCommand,
  RecoveryPasswordNewPasswordCommandProps,
} from '@module/user/application/commands/recovery-password-new-password/recovery-password-new-password.command';
import {
  RecoveryPasswordSendCodeCommand,
  RecoveryPasswordSendCodeCommandProps,
} from '@module/user/application/commands/recovery-password-send-code/recovery-password-send-code.command';
import { UserSaveFirstLoginCommand } from '@module/user/application/commands/user-save-first-login/user-save-first-login.command';
import { UserExistsQuery } from '@module/user/application/queries/user-exists/user-exists.query';

export class UserStub {
  static LoginControllerRequestStub(): LoginRequestDto {
    const dto = new LoginRequestDto();
    dto.deviceId = 'dummy';
    dto.deviceName = 'dummy';
    dto.password = 'secret';
    dto.username = 'dummyUser';

    return dto;
  }

  static refesAuthTokenControllerRequestStub(
    refreshToken = 'refreshAuthToken',
  ): RefreshAuthTokenRequestDto {
    const dto = new RefreshAuthTokenRequestDto();
    dto.refreshToken = refreshToken;
    return dto;
  }

  static recoveryPasswordCheckCodeControllerRequestStub(
    userUuId = '90120c3d-4a8d-4421-a3ac-5d03a2fb53d8',
    verificationCode = '8EDOP4',
    newPassword = 'correctlyPass',
  ): RecoveryPasswordCheckCodeRequest {
    const dto = new RecoveryPasswordCheckCodeRequest();
    dto.userUuId = userUuId;
    dto.verificationCode = verificationCode;
    dto.newPassword = newPassword;
    return dto;
  }

  static recoveryPasswordSendCodeControllerRequestStub(
    username = 'user',
  ): RecoveryPasswordSendCodeRequest {
    const dto = new RecoveryPasswordSendCodeRequest();
    dto.username = username;
    return dto;
  }

  static userExistsControllerRequestStub(): UserExistsRequestDto {
    const dto = new UserExistsRequestDto();
    dto.cpf = '98776098907897';
    return dto;
  }

  static saveFirstLoginControllerRequestStub(
    name = 'dummy',
    cpf = 'dummy',
    birthDate = '1972-02-01T00:00:00.000Z',
    email = 'dummy@imobideal.com',
    phone = '83998916031',
    password = 'dummy',
  ): UserSaveFirstLoginRequestDto {
    const dto = new UserSaveFirstLoginRequestDto();
    dto.name = name;
    dto.cpf = cpf;
    dto.birthDate = birthDate;
    dto.phone = phone;
    dto.email = email;
    dto.password = password;
    return dto;
  }

  static refreshAuthTokenCommandStub(
    refreshToken = 'refreshAuthToken',
  ): RefreshAuthTokenCommand {
    return new RefreshAuthTokenCommand({
      refreshToken,
    } as RefreshAuthTokenProps);
  }

  static loginCommandStub(
    deviceId = 'dummy',
    password = 'dummy',
    username = 'dummy',
    deviceName = 'dummy',
  ): LoginCommand {
    const props: LoginCommandProps = {
      deviceId: deviceId,
      password: password,
      username: username,
      deviceName: deviceName,
    };
    return new LoginCommand(props);
  }

  static userAggregrateStub(): Record<string, any> {
    return {
      uuid: '90120c3d-4a8d-4421-a3ac-5d03a2fb53d8',
      id: 1,
      username: 'devuser MOCKED',
      password: 'correctlyPass',
      usersGroup: [
        {
          uuid: 'b6792ae3-2f4d-418e-9615-9cd27c22b0e5',
          userGroup: { id: '1' },
          main: true,
          userGroupUserId: 14,
        },
      ],
      person: {
        uuid: '220ab7d5-9045-40f5-9689-fb011d8e263a',
        id: '1',
        contacts: [
          {
            uuid: '5a271d23-375d-462c-8eb7-cbad6f97379b',
            description: 'test@test.com.br',
            personContactType: { id: '1' },
            main: '1',
            id: '1',
          },
        ],
        cpf: '47943096002',
        name: 'null',
        birthDate: '1994-01-01',
      },
      devices: [
        {
          uuid: 'e7ad620a-e9b7-4a94-933e-19e0cc1f0b81',
          id: '24',
          deviceId: '123',
          deviceName: 'insomnia',
          authToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MDEyMGMzZC00YThkLTQ0MjEtYTNhYy01ZDAzYTJmYjUzZDgiLCJ1c2Vyc0dyb3VwcyI6W3sibWFpbiI6IjEiLCJpZCI6IjEifV0sImlhdCI6MTY5MTI2NzY2NiwiZXhwIjoxNjkxMjk2NDY2fQ.eVrag0ybPVkLQd9gl7bWXpz9X4mr7_QTNQckFFLLCs8',
          refreshToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MDEyMGMzZC00YThkLTQ0MjEtYTNhYy01ZDAzYTJmYjUzZDgiLCJ1c2Vyc0dyb3VwcyI6W3sibWFpbiI6IjEiLCJpZCI6IjEifV0sImRldmljZUlkIjoiMTIzIiwiaWF0IjoxNjkxMjY3NjY2LCJleHAiOjE2OTE1MjY4NjZ9.uf1G_FJ9heX8Wi4Tqcs3RUHUuu9VtZyKh7uPP7jWG5I',
          status: '1',
        },
      ],
    };
  }

  static recoveryPasswordNewPasswordCommandStub(
    newPassword = 'newPassword@1',
    userUuId = '90120c3d-4a8d-4421-a3ac-5d03a2fb53d8',
    verificationCode = '1234',
  ): RecoveryPasswordNewPasswordCommand {
    const props: RecoveryPasswordNewPasswordCommandProps = {
      newPassword: newPassword,
      userUuId: userUuId,
      verificationCode: verificationCode,
    };
    return new RecoveryPasswordNewPasswordCommand(props);
  }

  static recoveryPasswordSendCodeCommandStub(
    username = 'username',
  ): RecoveryPasswordSendCodeCommand {
    const props: RecoveryPasswordSendCodeCommandProps = {
      username,
    };
    return new RecoveryPasswordSendCodeCommand(props);
  }

  static saveFirstLoginCommandStub(cpf: string = '83390395806') {
    return new UserSaveFirstLoginCommand({
      name: 'dummy user',
      cpf: cpf,
      birthDate: '1972-02-01T00:00:00.000Z',
      phone: '99999999999',
      email: 'teste@teste',
      password: 'Password@1',
    });
  }
  static userExistsQueryStub(cpf: string = '54273132060') {
    return new UserExistsQuery({ cpf });
  }
}
