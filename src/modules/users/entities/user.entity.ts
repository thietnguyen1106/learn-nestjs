import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { Gender } from 'src/common/enum/gender.enum';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Entity()
export class User {
  @Column({ nullable: true })
  company: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'uuid' })
  creationUserId: UUIDTypes;

  @Column({ nullable: true })
  department: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column({ default: Gender.UNDEFINED })
  gender: Gender;

  @PrimaryGeneratedColumn('uuid')
  id: UUIDTypes;

  @Column({ type: 'uuid' })
  lastModifiedUserId: UUIDTypes;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column()
  salt: string;

  @Column({ default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  updatedAt: Date;

  @Column({ nullable: true })
  xToken: string;

  @Column({ nullable: true })
  xRefetchToken: string;

  @Column({ nullable: true })
  xRefetchTokenExpirationTime: number;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4(); // Assign a UUID if not already set
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    name: 'user_roles',
  })
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.users, {
    cascade: true,
  })
  @JoinTable({
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    name: 'user_permissions',
  })
  permissions: Permission[];
}
