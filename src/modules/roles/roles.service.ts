import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find({
      relations: ['users', 'permissions'],
    });
  }

  async findMultiple(ids: string[]) {
    return await this.roleRepository.find({
      relations: ['users', 'permissions'],
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: string) {
    return `This action removes a #${id} role`;
  }
}
