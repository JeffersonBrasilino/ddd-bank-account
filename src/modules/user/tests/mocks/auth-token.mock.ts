import { ErrorFactory } from '@core/domain/errors';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';

export class AuthTokenMock implements AuthTokenInterface {
  generateAuthToken(embededData: Partial<any>): string {
    return 'generateAuthToken';
  }
  generateRefreshToken(embededData: Partial<any>): string {
    return 'generateRefreshToken';
  }
  validateRefreshToken(refreshToken: string) {
    if (refreshToken == 'refreshAuthToken' || refreshToken == 'not_exists') {
      return {
        userId: '90120c3d-4a8d-4421-a3ac-5d03a2fb53d8',
        usersGroups: [{ main: '1', id: '1' }],
        deviceId: '123',
        iat: 1691441315,
        exp: 1691700515,
      };
    } else {
      return ErrorFactory.instance().create('InvalidData', '');
    }
  }
}
