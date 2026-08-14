import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Author {
  constructor(partial: Partial<Author>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email!: string;

  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  bio!: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt!: Date;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isDeleted!: boolean;

  @Column({
    name: 'author_slug',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  authorSlug!: string;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatarUrl!: string | null;

  @Column({
    name: 'background_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  backgroundUrl!: string | null;
}
