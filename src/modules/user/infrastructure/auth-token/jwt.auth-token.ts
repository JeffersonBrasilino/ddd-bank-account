import { ErrorFactory } from '@core/domain/errors';
import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
export class JwtAuthToken implements AuthTokenInterface {
  constructor(private service: JwtService, private config: ConfigService) {}
  generateAuthToken(embededData: Partial<any>): string {
    return this.service.sign(embededData);
  }

  generateRefreshToken(embededData: Partial<any>): string {
    const options: JwtSignOptions = {
      expiresIn: this.config.get('app').apiAuthRefreshTokenExpiration,
      secret: this.config.get('app').apiAuthRefreshTokenSalt,
    };
    return this.service.sign(embededData, options);
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const options: JwtSignOptions = {
        secret: this.config.get('app').apiAuthRefreshTokenSalt,
      };
      return this.service.verify(refreshToken, options);
    } catch (e) {
      return ErrorFactory.create('InvalidData', e.toString());
    }
  }
}
