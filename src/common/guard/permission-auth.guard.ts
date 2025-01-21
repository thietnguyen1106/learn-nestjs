import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
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
    const user = request.user;
    const permissionsList: Permission[] = [];

    const userRoles = await this.getUserRoles(user.id);

    const promiseRolePermissions = userRoles.map((role) => {
      if (role) {
        return this.getRolePermissions(role.id);
      }
    });
    const rolePermissions = (await Promise.all(promiseRolePermissions)).flatMap(
      (rolePermission) => rolePermission,
    );
    permissionsList.push(...rolePermissions);

    const userPermission = await this.getUserPermissions(user.id);
    permissionsList.push(...userPermission);

    const userPermissionCodes: string[] = [];
    for (let i = 0; i < permissionsList.length; i++) {
      if (userPermissionCodes.indexOf(permissionsList[i].code) < 0) {
        userPermissionCodes.push(permissionsList[i].code);
      }
    }

    if (
      intersection(userPermissionCodes, permissions)
        .sort()
        .toString()
        .replace(/[,]+/g, '') ===
      permissions.sort().toString().replace(/[,]+/g, '')
    ) {
      return true;
    } else {
      throw new ForbiddenException(
        `Sorry you are restricted from this function`,
      );
    }
  }

  private async getUserRoles(userId: string): Promise<Role[]> {
    return [];
  }

  private async getRolePermissions(roleId: string): Promise<Permission[]> {
    return [];
  }

  private async getUserPermissions(userId: string): Promise<Permission[]> {
    return [];
  }
}
