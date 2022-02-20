module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: 'desafio_mutual_db',
    port: 5432,
    username: 'pguser',
    password: 'pguser',
    database: 'postgres',
    logging: false,
    /* type: process.env.APP_DB_TYPE,
    host: process.env.APP_DB_HOST,
    port: process.env.APP_DB_PORT,
    username: process.env.APP_DB_USERNAME,
    password: process.env.APP_DB_PASSWORD,
    database: process.env.APP_DB_DATABASE,
    logging: process.env.APP_DB_LOGGING, */
    entities: [
      'dist/infrastructure/database/typeorm/entities/**/*.entity{ .ts,.js}',
    ],
    migrations: ['./src/infrastructure/database/typeorm/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/infrastructure/database/typeorm/migrations',
    },
  },
];
