import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(PUBLIC_KEY, true);
