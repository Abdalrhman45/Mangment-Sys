export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  employeeId?: number;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  employeeId?: number;
  expiresAt: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  employeeId?: number;
  isActive: boolean;
}