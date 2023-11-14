export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string | null;
  pictureURL: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string | null;
}
