import { ReadStream } from 'fs';

  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    stream: ReadStream;
    buffer: Buffer;
  }
  
  export class CreateAuthorDto {
    name!: string;
    email!: string;
    bio?: string;
    authorSlug!: string;
  }
  
  export class UpdateAuthorDto {
    name!: string;
    email!: string;
    bio!: string;

  }
  
  export class DeleteAuthorDto {
    id!: number;
  }

  export class UpdateAuthorPicDto {
    name!: string;
    email!: string;
    bio?: string;
    authorSlug!: string;
    avatar?: MulterFile;
    background?: MulterFile;
  }
  