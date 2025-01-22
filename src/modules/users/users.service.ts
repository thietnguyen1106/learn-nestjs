import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto) {
    const {
      companyId,
      departmentId,
      email,
      firstName,
      gender,
      lastName,
      password,
      phone,
      status,
      roleIds,
      permissionIds,
    } = createUserDto;

    const checkEmail = await this.userRepository.find({
      where: {
        email,
        status: Not(EntityStatus.DELETE),
      },
    });
    if (checkEmail.length > 0) {
      throw new ConflictException(`Email '${email}' already exist`);
    }

    const roles = roleIds
      ? await this.roleRepository.findBy({ id: In(roleIds) })
      : [];
    const permissions = permissionIds
      ? await this.permissionRepository.findBy({ id: In(permissionIds) })
      : [];

    const creationUserId = 'user.id';
    const lastModifiedUserId = 'user.id';
    const salt = await bcrypt.genSalt();
    const hashPassword = await this.hashPassword(password, salt);

    const newUser = this.userRepository.create({
      company: companyId,
      creationUserId,
      department: departmentId,
      email,
      firstName,
      gender,
      lastModifiedUserId,
      lastName,
      password: hashPassword,
      permissions,
      phone,
      roles,
      salt,
      status,
    });

    await this.userRepository.save(newUser);

    return await this.findMultiple([newUser.id]);
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['roles', 'permissions'],
    });

    return users.map((user) => omit(user, ['password', 'salt']));
  }

  async findMultiple(ids: string[]) {
    const users = await this.userRepository.find({
      relations: ['roles', 'permissions'],
      where: { id: In(ids) },
    });

    return users.map((user) => omit(user, ['password', 'salt']));
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const {
      companyId,
      departmentId,
      email,
      firstName,
      gender,
      lastName,
      phone,
      status,
      roleIds,
      roleDeleteIds,
      permissionIds,
      permissionDeleteIds,
    } = updateUserDto;

    const currentUser = (await this.findMultiple([id]))[0];
    if (!currentUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    if (email && email !== currentUser.email) {
      const checkEmail = await this.userRepository.find({
        where: {
          email,
          status: Not(EntityStatus.DELETE),
        },
      });
      if (checkEmail.length > 0) {
        throw new ConflictException(`Email '${email}' already exist`);
      }
    }

    const [roles, permissions] = await Promise.all([
      this.roleRepository.findBy({ id: In(roleIds) }),
      this.permissionRepository.findBy({ id: In(permissionIds) }),
    ]);

    const newUserRoles = currentUser.roles
      .filter((role) => !roleDeleteIds.includes(role.id))
      .concat(roles);
    const newUserPermissions = currentUser.permissions
      .filter((permission) => !permissionDeleteIds.includes(permission.id))
      .concat(permissions);

    const creationUserId = 'user.id';
    const lastModifiedUserId = 'user.id';

    const updatedUser = {
      ...currentUser,
      company: companyId,
      creationUserId,
      department: departmentId,
      email,
      firstName,
      gender,
      lastModifiedUserId,
      lastName,
      permissions: newUserPermissions,
      phone,
      roles: newUserRoles,
      status,
    };

    await this.userRepository.save(updatedUser);

    return await this.findMultiple([updatedUser.id]);
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
