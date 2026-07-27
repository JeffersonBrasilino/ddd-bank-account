export interface UuidInterface {
  generate(): string;

  isValid(uuid: string): boolean;
}
