import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { In, Repository } from 'typeorm';
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

  async create(createPermissionDto: CreatePermissionDto) {
    const { name, code, description, status, userIds, roleIds } =
      createPermissionDto;

    const roles = roleIds
      ? await this.roleRepository.findBy({ id: In(roleIds) })
      : [];
    const users = userIds
      ? await this.userRepository.findBy({ id: In(userIds) })
      : [];

    const permission = this.permissionRepository.create({
      code,
      description,
      name,
      roles,
      status,
      users,
    });

    await this.permissionRepository.save(permission);

    return await this.findMultiple([permission.id]);
  }

  async findAll() {
    const permissions = await this.permissionRepository.find({
      relations: ['roles', 'users'],
    });

    return permissions.map((permission) => {
      const { users, ...rest } = permission;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async findMultiple(ids: string[]) {
    const permissions = await this.permissionRepository.find({
      relations: ['roles', 'users'],
      where: { id: In(ids) },
    });

    return permissions.map((permission) => {
      const { users, ...rest } = permission;
      return {
        ...rest,
        users: users.map((user) => omit(user, ['password', 'salt'])),
      };
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  async remove(id: string) {
    return `This action removes a #${id} permission`;
  }
}
