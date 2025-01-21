import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    });

    const savedPermission = await this.permissionRepository.save(permission);

    if (users.length > 0) {
      for (const user of users) {
        user.permissions = [...(user.permissions || []), savedPermission];
        await this.userRepository.save(user);
      }
    }

    return await this.findMultiple([savedPermission.id]);
  }

  async findAll() {
    return await this.permissionRepository.find({
      relations: ['roles', 'users'],
    });
  }

  async findMultiple(ids: string[]) {
    return await this.permissionRepository.find({
      relations: ['roles', 'users'],
      where: { id: In(ids) },
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  async remove(id: string) {
    return `This action removes a #${id} permission`;
  }
}
