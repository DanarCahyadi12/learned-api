export interface UserPayload {
  id: string;
  name: string;
  pictureURL: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}
