export interface AuthTokenInterface {
  generateAuthToken(embededData: Partial<any>): string;
  generateRefreshToken(embededData: Partial<any>): string;
  validateRefreshToken(refreshToken: string);
}
