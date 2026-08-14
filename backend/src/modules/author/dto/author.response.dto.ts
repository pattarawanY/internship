export class AuthorResponseDto {
    id!: number;
    name!: string;
    email!: string;
    bio!: string | null;
    authorSlug!: string;
    createdAt!: Date;
    updatedAt!: Date;
  }

  export class AuthorResponseWithUrlDto {
    id!: number;
    name!: string;
    email!: string;
    bio!: string | null;
    authorSlug!: string;
    avatarUrl!: string | null;
    backgroundUrl!: string | null;
    createdAt!: Date;
    updatedAt!: Date;
  }

export class PaginatedResponse<T> {
    data!: T[];
    total!: number;
    page!: number;
    limit!: number;
  }

