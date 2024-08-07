import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();

const cold_db: any = {
  type: process.env.COLD_DB_TYPE,
  host: process.env.COLD_DB_HOST,
  port: process.env.COLD_DB_PORT,
  username: process.env.COLD_DB_USERNAME,
  password: process.env.COLD_DB_PASSWORD,
  database: process.env.COLD_DB_DATABASE,
};
export const dataSourceOptions: DataSourceOptions = {
  type: cold_db.type,
  host: cold_db.host,
  port: cold_db.port,
  username: cold_db.username,
  password: cold_db.password,
  database: cold_db.database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
