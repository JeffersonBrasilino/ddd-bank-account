import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class MovementDto {
  @IsNotEmpty({ message: 'valor nao pode ser vazio' })
  @ApiProperty({ description: 'valor da movimentacao' })
  value: number;
}
export class AccountDto {
  @IsNotEmpty({ message: 'nome nao pode ser vazio.' })
  @ApiProperty({ description: 'nome do proprietario da conta' })
  name: string;

  @IsNotEmpty({ message: 'cpf nao pode ser vazio.' })
  @ApiProperty({ description: 'cpf do proprietario da conta' })
  cpf: string;

  @ApiProperty({
    required: true,
    description: 'movimentacao inicial da conta.',
    isArray: false,
    type: MovementDto,
  })
  movement: MovementDto;
}
