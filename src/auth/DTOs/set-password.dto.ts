export class SetPasswordDto {
  id: string;
  expires: number;
  token: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  variable: any;
}
