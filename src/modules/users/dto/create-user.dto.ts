import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { Gender } from 'src/common/enum/gender.enum';

export class CreateUserDto {
  companyId?: string;

  departmentId?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  firstName: string;

  gender?: Gender;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password to weak',
  })
  password: string;

  phone?: string;

  status: EntityStatus;

  roleIds?: UUIDTypes[];

  permissionIds?: UUIDTypes[];
}
