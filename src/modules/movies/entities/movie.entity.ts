import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Topic } from 'src/modules/topics/entities/topic.entity';
import { Type } from 'src/modules/types/entities/type.entity';
import { Performer } from 'src/modules/performers/entities/performer.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDTypes;

  @Column()
  title: string;

  @Column({ nullable: true })
  subTitle: string;

  @Column({ nullable: true })
  posterUrl: string;

  @Column({ nullable: true })
  trailerUrl: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true })
  director: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ nullable: true })
  releaseDate: Date;

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

  @ManyToMany(() => Category, (category) => category.movies, { cascade: true })
  @JoinTable({
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    name: 'movie_categories',
  })
  categories: Category[];
  // Hành động, Viễn tưởng, Kinh dị,...

  @ManyToMany(() => Topic, (topic) => topic.movies, {
    cascade: true,
  })
  @JoinTable({
    inverseJoinColumn: { name: 'topic_id', referencedColumnName: 'id' },
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    name: 'movie_topics',
  })
  topics: Topic[];
  // Chiến tranh, gia đình, tội phạm, công nghệ, sinh tồn,...

  @ManyToMany(() => Type, (type) => type.movies, {
    cascade: true,
  })
  @JoinTable({
    inverseJoinColumn: { name: 'type_id', referencedColumnName: 'id' },
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    name: 'movie_types',
  })
  types: Type[];
  // Series, Phim bộ, Phim lẻ, Phim ngắn, phim truyền hình,...

  @ManyToMany(() => Performer, (performer) => performer.movies, {
    cascade: true,
  })
  @JoinTable({
    inverseJoinColumn: { name: 'performer_id', referencedColumnName: 'id' },
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    name: 'movie_performers',
  })
  performers: Performer[];

  @OneToMany(() => Comment, (comment) => comment.movie)
  comments: Comment[];
}
