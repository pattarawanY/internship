import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto, UpdateAuthorDto, UpdateAuthorPicDto } from './dto/author.request.dto';
import { AuthorResponseDto, AuthorResponseWithUrlDto, PaginatedResponse } from './dto/author.response.dto';

@Controller('authors')
export class AuthorsController {
    constructor(private readonly authorsService: AuthorsService) {}
    
    @Post()
    async createAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
        return this.authorsService.createAuthor(createAuthorDto);
    }

    @Put(':id')
    async updateAuthor(@Param('id') id: number, @Body() updateAuthorDto: UpdateAuthorDto): Promise<AuthorResponseDto> {
        return this.authorsService.updateAuthor(id, updateAuthorDto);
    }

    @Delete(':id')
    async deleteAuthor(@Param('id') id: number): Promise<void> {
        return this.authorsService.deleteAuthor(id);
    }

    @Put(':id/pic')
    async updateAuthorPic(@Param('id') id: number, @Body() updateAuthorPicDto: UpdateAuthorPicDto): Promise<AuthorResponseWithUrlDto> {
        return this.authorsService.updateAuthorPic(id, updateAuthorPicDto);
    }

    @Get(':slug')
    async getAuthorBySlug(@Param('slug') slug: string): Promise<AuthorResponseWithUrlDto> {
        return this.authorsService.getAuthorBySlug(slug);
    }

    @Get()
    async getAllAuthors(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<PaginatedResponse<AuthorResponseWithUrlDto>> {
        return this.authorsService.getAllAuthors(page, limit);
    }
}
