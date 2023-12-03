export type ClassroomEntity = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  bannerURL: string;
  createdAt: Date;
  updateAt: Date;
  userID: string;
};
