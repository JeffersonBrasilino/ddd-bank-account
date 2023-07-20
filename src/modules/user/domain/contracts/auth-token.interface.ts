export interface AuthTokenInterface {
  generate(embededData: Partial<any>): string;
}
