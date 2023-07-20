import { AuthTokenInterface } from '@module/user/domain/contracts/auth-token.interface';
import { JwtService } from '@nestjs/jwt';
export class JwtAuthToken implements AuthTokenInterface {
  constructor(private service: JwtService) {}
  generate(embededData: Partial<any>): string {
    return this.service.sign(embededData);
  }
}
