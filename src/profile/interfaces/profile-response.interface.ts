import { ProfilePayload } from './profile-payload.interface';

export interface ProfileResponse {
  status: string;
  message: string;
  data: ProfilePayload;
}
