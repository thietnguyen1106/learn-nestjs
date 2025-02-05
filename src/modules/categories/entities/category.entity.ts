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
import { Topic } from 'src/modules/topics/entities/topic.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDTypes;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

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

  @ManyToMany(() => Movie, (movie) => movie.categories)
  movies: Movie[];

  @ManyToMany(() => Topic, (topic) => topic.categories)
  topics: Topic[];
}
