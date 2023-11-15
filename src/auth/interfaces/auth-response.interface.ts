export interface AuthResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
  };
}
