import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RecoveryPasswordCheckCodeRequest {
  @ApiProperty({ description: 'usuário Uuid' })
  @IsNotEmpty()
  userUuId: string;

  @ApiProperty({ description: 'Código de verificação' })
  @IsNotEmpty()
  verificationCode: string;

  @ApiProperty({ description: 'nova senha' })
  @IsNotEmpty()
  newPassword: string;
}
