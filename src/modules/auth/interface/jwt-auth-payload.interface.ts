import { UUIDTypes } from 'uuid';

export interface JwtAuthPayLoad {
  id: UUIDTypes;
  fullName: string;
}
