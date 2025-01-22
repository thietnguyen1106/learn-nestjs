import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { omit } from 'lodash';
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

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, status, userIds, permissionIds } = createRoleDto;

    const users = userIds
      ? await this.userRepository.findBy({ id: In(userIds) })
      : [];
    const permissions = permissionIds
      ? await this.permissionRepository.findBy({ id: In(permissionIds) })
      : [];

    const role = this.roleRepository.create({
      description,
      name,
      permissions,
      status,
      users,
    });

    await this.roleRepository.save(role);

    return await this.findMultiple([role.id]);
  }

  async findAll() {
    const roles = await this.roleRepository.find({
      relations: ['users', 'permissions'],
    });

    return roles.map((role) => {
      const { users, ...rest } = role;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async findMultiple(ids: string[]) {
    const roles = await this.roleRepository.find({
      relations: ['users', 'permissions'],
      where: { id: In(ids) },
    });

    return roles.map((role) => {
      const { users, ...rest } = role;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const {
      name,
      description,
      status,
      userIds,
      userDeleteIds,
      permissionIds,
      permissionDeleteIds,
    } = updateRoleDto;

    const currentRole = (await this.findMultiple([id]))[0];

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
      name,
      permissions: newPermissions,
      status,
      users: newUsers,
    };

    await this.roleRepository.save(roleUpdated);

    return await this.findMultiple([roleUpdated.id]);
  }

  async remove(id: string) {
    return `This action removes a #${id} role`;
  }
}
