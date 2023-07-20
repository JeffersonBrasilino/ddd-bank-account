export interface CryptPasswordInterface {
  check(rawPassword: string, hashPassword: string): boolean;
  crypt(rawPassword: string): string;
}
