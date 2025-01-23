import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { omit } from 'lodash';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { getStatusCondition } from 'src/utils/getStatusCondition';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: User) {
    const {
      name,
      code,
      description,
      status,
      userIds = [],
      roleIds = [],
    } = createPermissionDto;

    const [users, roles] = await Promise.all([
      this.userRepository.findBy({ id: In(userIds) }),
      this.roleRepository.findBy({ id: In(roleIds) }),
    ]);

    const permission = this.permissionRepository.create({
      code,
      creationUserId: user.id,
      description,
      lastModifiedUserId: user.id,
      name,
      roles,
      status,
      users,
    });

    await this.permissionRepository.save(permission);

    return this.findMultiple([permission.id], user);
  }

  async findAll(user: User) {
    const permissions = await this.permissionRepository.find({
      relations: ['roles', 'users'],
      where: {
        ...getStatusCondition(user),
      },
    });

    return permissions.map((permission) => {
      const { users, ...rest } = permission;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async findMultiple(ids: string[], user: User) {
    const permissions = await this.permissionRepository.find({
      relations: ['roles', 'users'],
      where: { id: In(ids), ...getStatusCondition(user) },
    });

    return permissions.map((permission) => {
      const { users, ...rest } = permission;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: User,
  ) {
    const {
      name,
      code,
      description,
      status,
      userIds = [],
      userDeleteIds = [],
      roleIds = [],
      roleDeleteIds = [],
    } = updatePermissionDto;

    if (code) {
      const checkPermissionCode = await this.permissionRepository.findOne({
        where: { code },
      });
      if (checkPermissionCode) {
        throw new ConflictException(
          `Permission with code ${code} already exists`,
        );
      }
    }

    const currentPermission = (await this.findMultiple([id], user))[0];

    if (!currentPermission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    const [users, roles] = await Promise.all([
      this.userRepository.findBy({ id: In(userIds) }),
      this.roleRepository.findBy({ id: In(roleIds) }),
    ]);

    const newUsers = currentPermission.users
      .filter((user) => !userDeleteIds.includes(user.id))
      .concat(users);
    const newRoles = currentPermission.roles
      .filter((role) => !roleDeleteIds.includes(role.id))
      .concat(roles);

    const permissionUpdated = {
      ...currentPermission,
      code,
      description,
      lastModifiedUserId: user.id,
      name,
      roles: newRoles,
      status,
      users: newUsers,
    };

    await this.permissionRepository.save(permissionUpdated);

    return this.findMultiple([permissionUpdated.id], user);
  }

  async remove(id: string, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
