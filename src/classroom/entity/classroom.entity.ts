export type ClassroomEntity = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  bannerURL: string;
  bannerPath: string | null;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
};
