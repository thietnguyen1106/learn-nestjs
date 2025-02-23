import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UUIDTypes } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { getStatusCondition } from 'src/utils/getStatusCondition';
import { EntityUtils } from 'src/common/utils/entity.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class UsersService {
  private readonly entityUtils: EntityUtils;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly dataSource: DataSource,
  ) {
    this.entityUtils = new EntityUtils(this.dataSource);
  }

  async create(createUserDto: CreateUserDto, user: User) {
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
      roleIds = [],
      permissionIds = [],
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

    const [roles, permissions, salt] = await Promise.all([
      this.roleRepository.findBy({ id: In(roleIds) }),
      this.permissionRepository.findBy({ id: In(permissionIds) }),
      bcrypt.genSalt(),
    ]);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      company: companyId,
      creationUserId: user.id,
      department: departmentId,
      email,
      firstName,
      gender,
      lastModifiedUserId: user.id,
      lastName,
      password: hashPassword,
      permissions,
      phone,
      roles,
      salt,
      status,
    });

    await this.userRepository.save(newUser);

    return this.findMultiple({ ids: [newUser.id], user });
  }

  async findAll(params: {
    user: User;
    isSkipRelations?: boolean;
    isSkipSensitives?: boolean;
  }) {
    const { user, isSkipRelations = false, isSkipSensitives = true } = params;

    const relations = this.entityUtils.getRelations({
      entity: User,
      isSkipRelations,
    });

    const select = this.entityUtils.getSelect({
      entity: User,
      isSkipSensitives,
    });

    const users = await this.userRepository.find({
      relations,
      select,
      where: {
        ...getStatusCondition(user),
      },
    });

    return users;
  }

  async findMultiple(params: {
    ids: UUIDTypes[];
    user: User;
    isSkipRelations?: boolean;
    isSkipSensitives?: boolean;
  }) {
    const {
      ids,
      user,
      isSkipRelations = false,
      isSkipSensitives = true,
    } = params;
    const relations = this.entityUtils.getRelations({
      entity: User,
      isSkipRelations,
    });

    const select = this.entityUtils.getSelect({
      entity: User,
      isSkipSensitives,
    });

    const users = await this.userRepository.find({
      relations,
      select,
      where: {
        id: In(ids),
        ...getStatusCondition(user),
      },
    });

    return users;
  }

  async update(id: UUIDTypes, updateUserDto: UpdateUserDto, user: User) {
    const {
      companyId,
      departmentId,
      email,
      firstName,
      gender,
      lastName,
      phone,
      status,
      roleIds = [],
      roleDeleteIds = [],
      permissionIds = [],
      permissionDeleteIds = [],
    } = updateUserDto;

    const currentUser = (
      await this.findMultiple({
        ids: [id],
        user,
      })
    )[0];

    if (!currentUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    if (email && email !== currentUser.email) {
      const checkEmail = await this.userRepository.find({
        where: {
          email,
          ...getStatusCondition(user),
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

    const updatedUser = {
      ...currentUser,
      company: companyId,
      creationUserId: user.id,
      department: departmentId,
      email,
      firstName,
      gender,
      lastModifiedUserId: user.id,
      lastName,
      permissions: newUserPermissions,
      phone,
      roles: newUserRoles,
      status,
    };

    await this.userRepository.save(updatedUser);

    return this.findMultiple({ ids: [updatedUser.id], user });
  }

  async remove(id: UUIDTypes, user: User) {
    return this.update(id, { status: EntityStatus.DELETE }, user);
  }
}
