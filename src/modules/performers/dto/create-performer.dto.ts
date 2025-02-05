import { EntityStatus } from 'src/common/enum/entity-status.enum';

export class CreatePerformerDto {
  name: string;
  avatarUrl?: string;
  sex?: string;
  dateOfBirth?: string;
  nation?: string;
  biography?: string;
  link?: string;
  status?: EntityStatus;
}
