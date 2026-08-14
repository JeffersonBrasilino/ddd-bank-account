import { ApiProperty } from '@nestjs/swagger';

export class ErrorDetailDto {
  @ApiProperty({ example: 'password' })
  field: string;

  @ApiProperty({ example: 'password should not be empty' })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 'Invalid password' })
  message: string;

  @ApiProperty({ example: 'INVALID_PASSWORD' })
  code: string;

  @ApiProperty({
    type: () => [ErrorDetailDto],
    nullable: true,
    description: 'Per-field validation errors (null when no per-field errors)',
  })
  details: ErrorDetailDto[] | null;
}
