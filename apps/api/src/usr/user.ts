export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  roles: string[];
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}