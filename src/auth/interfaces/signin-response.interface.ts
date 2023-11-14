export interface SignInResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
  };
}
