import { DetailClassroomEntity } from '../entity';

export interface DetailClassroomResponse {
  status: string;
  message: string;
  data: DetailClassroomEntity;
}
