export interface DetailClassroomEntity {
  id: string;
  code: string;
  name: string;
  description: string;
  bannerURL: string;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
  totalParticipant: number;
  totalAssignment: number;
  totalMaterial: number;
  totalQuiz: number;
  totalSubmitedAssignment: number;
  totalFinishedQuiz: number;
}
