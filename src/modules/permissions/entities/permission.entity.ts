import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
} from 'typeorm';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity()
export class Permission {
  @Column()
  code: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'uuid' })
  creationUserId: UUIDTypes;

  @Column({ nullable: true })
  description: string;

  @PrimaryGeneratedColumn('uuid')
  id: UUIDTypes;

  @Column({ type: 'uuid' })
  lastModifiedUserId: UUIDTypes;

  @Column({ default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @Column()
  name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4(); // Assign a UUID if not already set
    }
  }

  @ManyToMany(() => User, (user) => user.permissions)
  users: User[];

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
