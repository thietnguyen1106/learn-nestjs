import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreateCategoryDto {
  name: string;
  description?: string;
  status?: EntityStatus;
}
