export interface JwtDecode {
  id: string;
  email: string;
  username: string;
  name: string;
  iat: number;
  exp: number;
}

export interface Context {
  currentUser: JwtDecode | null;
}
