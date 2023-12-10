import { AssignmentEntity } from '../entity';

export interface CreatedAssignmentResponse {
  status: string;
  message: string;
  data: {
    totalAssignment: number;
    assignments: AssignmentEntity[];
  };
}
