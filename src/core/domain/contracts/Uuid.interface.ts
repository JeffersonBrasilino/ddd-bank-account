export interface IUuIdInterface {
  generate(): string;

  isValid(uuid: string): boolean;
}
