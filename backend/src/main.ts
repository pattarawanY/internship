import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  });

  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log(
      `Database connected successfully (${dataSource.options.database})`,
    );
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Backend is running on http://localhost:${port}`);
}
void bootstrap();
