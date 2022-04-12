interface MovementDto {
  value: number;
}
export interface CreateAccountDto {
  cpf: string;
  name: string;
  movement: MovementDto[];
}
