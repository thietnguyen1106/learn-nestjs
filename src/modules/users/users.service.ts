import { ConflictException, Injectable } from '@nestjs/common';
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

    const newUserCreated = await this.userRepository.save(newUser);

    return omit(newUserCreated, ['username', 'password', 'salt']);
  }

  async findAll() {
    return await this.userRepository.find({
      relations: ['roles', 'permissions'],
    });
  }

  async findMultiple(ids: string[]) {
    return await this.userRepository.find({
      relations: ['roles', 'permissions'],
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
