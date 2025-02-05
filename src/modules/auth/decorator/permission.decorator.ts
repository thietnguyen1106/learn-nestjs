import { SetMetadata } from '@nestjs/common';
import { PERMISSION_META_DATA_KEY } from 'src/config/permission';

export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSION_META_DATA_KEY, permissions);
