import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshAuthTokenRequestDto {
  @ApiProperty({ description: 'refreshToken' })
  @IsNotEmpty()
  refreshToken: string;
}
