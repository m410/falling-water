export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  created_at: Date;
  role: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}