export interface ProfilePayload {
  id: string;
  name: string;
  bio: string | null;
  avatarURL: string;
  createdAt: Date;
  updatedAt: Date;
}
