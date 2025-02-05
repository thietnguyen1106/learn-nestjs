import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
} from 'typeorm';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { Movie } from 'src/modules/movies/entities/movie.entity';

@Entity()
export class Performer {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDTypes;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  nation: string;

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'uuid' })
  creationUserId: UUIDTypes;

  @Column({ type: 'uuid' })
  lastModifiedUserId: UUIDTypes;

  @Column({ default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4(); // Assign a UUID if not already set
    }
  }

  @ManyToMany(() => Movie, (movie) => movie.performers)
  movies: Movie[];
}
