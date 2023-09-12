import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserExistsRequestDto {
  @ApiProperty({ description: 'cpf a ser consultado' })
  @IsNotEmpty()
  cpf: string;
}
