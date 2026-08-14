import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../author.entity';
import {
  CreateAuthorDto,
  UpdateAuthorDto,
  UpdateAuthorPicDto,
} from '../dto/author.request.dto';
import {
  AuthorResponseDto,
  AuthorResponseWithUrlDto,
  PaginatedResponse,
} from '../dto/author.response.dto';

@Injectable()
export class AuthorsRepository {
  constructor(
    @InjectRepository(Author)
    private readonly repository: Repository<Author>,
  ) {}
  
  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    const author = this.repository.create(createAuthorDto);
    return this.repository.save(author);
  }

  async updateAuthor(id: number, updateAuthorDto: UpdateAuthorDto): Promise<AuthorResponseDto> {
    const author = await this.repository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    Object.assign(author, updateAuthorDto);
    return this.repository.save(author);
  }

  async deleteAuthor(id: number): Promise<void> {
    const author = await this.repository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    await this.repository.delete(id);
  }

  async getAuthorBySlug(authorSlug: string): Promise<AuthorResponseWithUrlDto> {
    const author = await this.repository.findOne({ where: { authorSlug } });
    if (!author) {
      throw new NotFoundException(`Author with slug ${authorSlug} not found`);
    }
    return author;
  }

  async updateAuthorPic(
    id: number,
    updateAuthorPicDto: UpdateAuthorPicDto,
  ): Promise<AuthorResponseWithUrlDto> {
    const author = await this.repository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    const { avatar, background, ...authorData } = updateAuthorPicDto;
    Object.assign(author, authorData);

    if (avatar) {
      author.avatarUrl = `/uploads/${avatar.originalname}`;
    }
    if (background) {
      author.backgroundUrl = `/uploads/${background.originalname}`;
    }

    return this.repository.save(author);
  }

  async getAllAuthors(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<AuthorResponseWithUrlDto>> {
    const [data, total] = await this.repository.findAndCount({
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }
}
