import { AssignmentEntity } from '../entity';

export interface GetDetailAssignmentResponse {
  status: string;
  message: string;
  data: AssignmentEntity;
}
