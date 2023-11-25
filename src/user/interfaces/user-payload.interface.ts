export interface UserPayload {
  id: string;
  name: string;
  avatarURL: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}
