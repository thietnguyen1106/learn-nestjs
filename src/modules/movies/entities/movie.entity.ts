import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { MovieType } from 'src/common/enum/movie-type.enum';

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
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: MovieType.MOVIE })
  type: MovieType;

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

  // category: Hành động, Viễn tưởng, Kinh dị,...

  // type: Series, Phim bộ, Phim lẻ, Phim ngắn, phim truyền hình,...

  // topic: Chiến tranh, gia đình, tội phạm, công nghệ, sinh tồn,...

  // performer

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4(); // Assign a UUID if not already set
    }
  }
}
