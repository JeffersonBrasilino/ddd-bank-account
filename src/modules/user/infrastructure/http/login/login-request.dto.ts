import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ description: 'Usuário' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Senha' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Identificador único do dispositivo' })
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description: 'nome(apelido) do dispositivo.',
    required: false,
  })
  @IsOptional()
  deviceName: string;
}
