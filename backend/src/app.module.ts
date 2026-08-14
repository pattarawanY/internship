import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfig } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthorsModule } from './modules/author/authors.module';

@Module({
  // ถ้าไม่ใส่ใน Module nestjs จะไม่รู้จักคลาสนี้
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeormConfig,
    }),
    UsersModule, // สร้าง Module มาใหม่ต้องมา import ตรงนี้ก่อน
    AuthorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
