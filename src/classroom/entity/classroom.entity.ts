export type ClassroomEntity = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  bannerURL: string;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
};
