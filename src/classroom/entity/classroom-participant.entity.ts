export type ClassroomParticipantEntity = {
  id: string;
  pin: boolean;
  userID: string;
  classroomID: string;
  joinedAt: Date;
  role: string;
};
