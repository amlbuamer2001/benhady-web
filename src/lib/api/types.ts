export interface ApiResponse<T> {
  code: number;
  data: T;
  messages: string[];
  errors: unknown;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  type: string;
  status: string;
}
