import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH_META_DATA_KEY } from 'src/config/permission';

export const SkipAuth = () => SetMetadata(SKIP_AUTH_META_DATA_KEY, true);