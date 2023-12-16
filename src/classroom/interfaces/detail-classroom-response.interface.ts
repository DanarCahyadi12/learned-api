export interface DetailClassroomResponse {
  status: string;
  message: string;
  data: {
    id: string;
    code: string;
    name: string;
    description: string;
    bannerURL: string;
    createdAt: Date;
    updatedAt: Date;
    userID: string;
    total: {
      participant: number;
      assignment: number;
      material: number;
      quiz: number;
      submitedAssignment: number;
      finishedQuiz: number;
    };
  };
}
