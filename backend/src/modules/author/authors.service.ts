import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from './repository/authors.repository';
import { CreateAuthorDto, UpdateAuthorDto, UpdateAuthorPicDto } from './dto/author.request.dto';
import { AuthorResponseDto, AuthorResponseWithUrlDto, PaginatedResponse } from './dto/author.response.dto';

@Injectable() //บอกว่าคลาสนี้injectให้คลาสอื่นได้
export class AuthorsService {
  constructor(private readonly authorsRepository: AuthorsRepository) {} //รับrepositoryมาใช้งาน ไม่ต้องnew

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    return this.authorsRepository.createAuthor(createAuthorDto); //เรียกใช้งานฟังก์ชันจากrepository
  }

  async updateAuthor(id: number, updateAuthorDto: UpdateAuthorDto): Promise<AuthorResponseDto> {
    return this.authorsRepository.updateAuthor(id, updateAuthorDto);
  }

  async deleteAuthor(id: number): Promise<void> {
    return this.authorsRepository.deleteAuthor(id);
  }

  async updateAuthorPic(id: number, updateAuthorPicDto: UpdateAuthorPicDto): Promise<AuthorResponseWithUrlDto> {
    return this.authorsRepository.updateAuthorPic(id, updateAuthorPicDto);
  }

  async getAuthorBySlug(authorSlug: string): Promise<AuthorResponseWithUrlDto> {
    return this.authorsRepository.getAuthorBySlug(authorSlug);
  }

  async getAllAuthors(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<AuthorResponseWithUrlDto>> {
    return this.authorsRepository.getAllAuthors(page, limit);
  }
}
