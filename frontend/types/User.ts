export interface User {
  _uid: string;
  username: string;
  password: string;
  email: string;
  isAdmin?: boolean;
}
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ValidationErrorDetail {
  message: string;
  path: string[];
  type: string;
  context: {
    limit?: number;
    value: string;
    label: string;
    key: string;
  };
}

export interface ValidationError {
  _original: {
    username?: string;
    email?: string;
    password?: string;
  };
  details: ValidationErrorDetail[];
}

export interface UserResponse {
  user?: User;
  message: string;
  token: string;
  error?: ValidationError;
  newUser?: User; // signupUser
}

export interface UsersResponse {
  users: User[];
}
