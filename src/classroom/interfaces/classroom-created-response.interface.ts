import { ClassroomCreatedEntity } from '../entity';

export interface ClassroomCreatedResponse {
  status: string;
  message: string;
  data: {
    totalPage: number;
    prev: string | null;
    currentPage: number;
    next: string | null;
    items: {
      totalClassroom: number;
      classrooms: ClassroomCreatedEntity[];
    };
  };
}
