export interface AuthTokenPayload {
  sub: string;
  aud: string;
  userId?: string;
}
