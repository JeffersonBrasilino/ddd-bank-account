import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AccountDebitDto {
  @IsNotEmpty({ message: 'valor nao pode ser vazio' })
  @IsNumber({}, { message: 'valor do credito invalido' })
  @ApiProperty({ description: 'valor do credito' })
  value: number;
}
