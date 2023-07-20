import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ description: 'Usuário' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Senha' })
  @IsNotEmpty()
  password: string;
}
