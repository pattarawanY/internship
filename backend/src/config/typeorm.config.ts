import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getOrThrow<string>('PGHOST'),
  port: parseInt(config.get<string>('PGPORT') ?? '5432', 10),
  username: config.getOrThrow<string>('PGUSER'),
  password: config.getOrThrow<string>('PGPASSWORD'),
  database: config.getOrThrow<string>('PGDATABASE'),
  ssl: { rejectUnauthorized: false },
  autoLoadEntities: true,
  synchronize: false,
});
