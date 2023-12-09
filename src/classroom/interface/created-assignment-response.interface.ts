import { CreatedAssignmentEntity } from '../entity';

export interface CreatedAssignmentResponse {
  status: string;
  message: string;
  data: {
    total: number;
    assignments: CreatedAssignmentEntity[];
  };
}
