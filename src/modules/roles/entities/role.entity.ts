import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Entity()
export class Role {
  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt: Date;

  @Column()
  creationUserId: string;

  @Column({ nullable: true })
  description: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastModifiedUserId: string;

  @Column()
  name: string;

  @Column({
    default: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4(); // Assign a UUID if not already set
    }
  }

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    name: 'role_permissions',
  })
  permissions: Permission[];
}
