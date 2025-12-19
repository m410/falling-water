export interface TokenPayload {
  id: number;
  username: string;
  roles: string[];
  exp: number;
}
