export interface UpdateUserResponse {
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    bio: string;
    avatarURL: string;
  };
}
