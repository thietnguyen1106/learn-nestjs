import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { Category } from 'src/modules/categories/entities/category.entity';

@Entity()
export class Topic {
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

  @ManyToMany(() => Movie, (movie) => movie.topics)
  movies: Movie[];

  @ManyToMany(() => Category, (category) => category.topics, {
    cascade: true,
  })
  @JoinTable({
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    joinColumn: { name: 'topic_id', referencedColumnName: 'id' },
    name: 'topic_categories',
  })
  categories: Category[];
}
