export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string | null;
  pictureURL: string | null;
  bio: string | null;
  tokenPassword: string | null;
  tokenPasswordExpires: bigint | number | null;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string | null;
}
