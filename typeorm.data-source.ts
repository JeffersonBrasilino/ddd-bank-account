import { DataSourceOptions } from 'typeorm';

export const Connections = {
  default: {
    type: process.env.APP_DB_TYPE ?? 'postgres',
    host: process.env.APP_DB_HOST ?? 'localhost',
    port: process.env.APP_DB_PORT ?? '15432',
    username: process.env.APP_DB_USERNAME ?? 'postgres',
    password: process.env.APP_DB_PASSWORD ?? 'root',
    database: process.env.APP_DB_DATABASE ?? 'postgres',
    logging: process.env.APP_DB_LOGGING ?? true,
    synchronize: false,
    entities: [
      './dist/src/modules/**/infrastructure/database/typeorm/entities/*.entity{.ts,.js}',
    ],
    migrations: ['./typeorm-migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/typeorm-migrations',
    },
  } as DataSourceOptions,
};
