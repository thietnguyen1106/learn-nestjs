import { UUIDTypes } from 'uuid';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { Gender } from 'src/common/enum/gender.enum';

export class CreateUserDto {
  @IsOptional()
  companyId?: string;

  @IsOptional()
  departmentId?: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is not formatted correctly',
  })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsOptional()
  @IsUUID('4', { each: true })
  roleIds?: UUIDTypes[];

  @IsOptional()
  @IsUUID('4', { each: true })
  permissionIds?: UUIDTypes[];
}
