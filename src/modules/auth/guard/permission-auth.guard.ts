import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { UsersService } from 'src/modules/users/users.service';
import { RolesService } from 'src/modules/roles/roles.service';
import {
  COMPARE_TYPES,
  META_DATA_KEY,
  PERMISSION_AUTH,
} from 'src/config/permission';

@Injectable()
export class PermissionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      META_DATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request, permissions);
  }

  private async validateRequest(
    request: any,
    permissions: string[],
  ): Promise<boolean> {
    const requestUser = request.user;

    const user = (
      await this.usersService.findMultiple([requestUser.id], requestUser)
    )[0];

    if (!user) {
      throw new ForbiddenException(`User not found`);
    }

    const rolePermissions = await this.rolesService.findMultiple(
      user.roles.map((role) => role.id),
      requestUser,
    );
    const permissionsList: Permission[] = [
      ...rolePermissions
        .map((rolePermission) => rolePermission.permissions)
        .flatMap((permission) => permission),
      ...user.permissions,
    ];

    const userPermissionCodes: string[] = [];
    for (let i = 0; i < permissionsList.length; i++) {
      if (userPermissionCodes.indexOf(permissionsList[i].code) < 0) {
        userPermissionCodes.push(permissionsList[i].code);
      }
    }

    if (permissions[0] === COMPARE_TYPES.OR) {
      return userPermissionCodes.some((element) =>
        permissions.filter((_item, i) => i > 0).includes(element),
      );
    }

    if (
      intersection(userPermissionCodes, permissions)
        .sort()
        .toString()
        .replace(/[,]+/g, '') ===
        permissions.sort().toString().replace(/[,]+/g, '') ||
      userPermissionCodes.includes(PERMISSION_AUTH.ALL)
    ) {
      return true;
    } else {
      throw new ForbiddenException(
        `Sorry you are restricted from this function`,
      );
    }
  }
}
