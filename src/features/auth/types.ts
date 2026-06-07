export interface AuthFormState {
  error: string;
  success: boolean;
}

export const initialAuthState: AuthFormState = {
  error: "",
  success: false,
};

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}
