import { MaterialFilesEntity } from './material-files.entity';

export interface MaterialsEntity {
  id: string;
  title: string;
  description: string;
  classroomID: string;
  updatedAt: Date;
  files?: MaterialFilesEntity[];
}
