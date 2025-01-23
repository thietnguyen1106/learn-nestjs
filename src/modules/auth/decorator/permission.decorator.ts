import { SetMetadata } from '@nestjs/common';
import { META_DATA_KEY } from 'src/config/permission';

export const Permissions = (...permissions: string[]) =>
  SetMetadata(META_DATA_KEY, permissions);
