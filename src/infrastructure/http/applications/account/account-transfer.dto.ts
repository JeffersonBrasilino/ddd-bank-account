import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AccountTransferDto {
  @IsNotEmpty({ message: 'unique id(uuid) da conta de origem obrigatorio.' })
  @ApiProperty({ description: 'unique id(uuid) da conta de origem' })
  accountOriginId: string;

  @IsNotEmpty({ message: 'unique id(uuid) da conta de destino obrigatorio.' })
  @ApiProperty({ description: 'unique id(uuid) da conta de destino' })
  accountDestinyId: string;

  @IsNotEmpty({ message: 'valor nao pode ser vazio' })
  @IsNumber({}, { message: 'valor a ser transferido invalido' })
  @ApiProperty({ description: 'valor a ser transferido' })
  value: number;
}
