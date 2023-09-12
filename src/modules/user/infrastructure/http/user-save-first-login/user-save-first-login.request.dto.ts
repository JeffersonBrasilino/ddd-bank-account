import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSaveFirstLoginRequestDto {
  @ApiProperty({ description: 'cpf do usuario' })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ description: 'nome do usuario' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'email do usuario' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'telefone do usuario' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'data de nascimento do usuario' })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({ description: 'senha do usuario' })
  @IsNotEmpty()
  password: string;
}
