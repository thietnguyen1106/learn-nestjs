import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { omit } from 'lodash';
import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { getStatusCondition } from 'src/utils/getStatusCondition';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: User) {
    const {
      name,
      description,
      status,
      userIds = [],
      permissionIds = [],
    } = createRoleDto;

    const [users, permissions] = await Promise.all([
      this.userRepository.findBy({ id: In(userIds) }),
      this.permissionRepository.findBy({ id: In(permissionIds) }),
    ]);

    const role = this.roleRepository.create({
      creationUserId: user.id,
      description,
      lastModifiedUserId: user.id,
      name,
      permissions,
      status,
      users,
    });

    await this.roleRepository.save(role);

    return this.findMultiple([role.id], user);
  }

  async findAll(user: User) {
    const roles = await this.roleRepository.find({
      relations: ['users', 'permissions'],
      where: {
        ...getStatusCondition(user),
      },
    });

    return roles.map((role) => {
      const { users, ...rest } = role;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async findMultiple(ids: UUIDTypes[], user: User) {
    const roles = await this.roleRepository.find({
      relations: ['users', 'permissions'],
      where: {
        id: In(ids),
        ...getStatusCondition(user),
      },
    });

    return roles.map((role) => {
      const { users, ...rest } = role;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async update(id: UUIDTypes, updateRoleDto: UpdateRoleDto, user: User) {
    const {
      name,
      description,
      status,
      userIds = [],
      userDeleteIds = [],
      permissionIds = [],
      permissionDeleteIds = [],
    } = updateRoleDto;

    const currentRole = (await this.findMultiple([id], user))[0];

    if (!currentRole) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    const [users, permissions] = await Promise.all([
      this.userRepository.findBy({ id: In(userIds) }),
      this.permissionRepository.findBy({ id: In(permissionIds) }),
    ]);

    const newUsers = currentRole.users
      .filter((user) => !userDeleteIds.includes(user.id))
      .concat(users);
    const newPermissions = currentRole.permissions
      .filter((permission) => !permissionDeleteIds.includes(permission.id))
      .concat(permissions);

    const roleUpdated = {
      ...currentRole,
      description,
      lastModifiedUserId: user.id,
      name,
      permissions: newPermissions,
      status,
      users: newUsers,
    };

    await this.roleRepository.save(roleUpdated);

    return this.findMultiple([roleUpdated.id], user);
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
