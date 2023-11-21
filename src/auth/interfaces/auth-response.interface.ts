export interface AuthResponse {
  status: string;
  message: string;
  code?: number;
  data?: {
    accessToken: string;
  };
}
