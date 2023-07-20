import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RecoveryPasswordSendCodeRequest {
  @ApiProperty({ description: 'Usuário' })
  @IsNotEmpty()
  username: string;
}
