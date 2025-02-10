export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Additional useful types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  password_confirmation?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
