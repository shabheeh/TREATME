export interface AuthState {
  email: string;
  role: "patient" | "doctor" | "admin" | null;
  token: string | null;
  isAuthenticated: boolean;
}
