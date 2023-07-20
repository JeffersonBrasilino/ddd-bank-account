import { DataSource } from 'typeorm';
import { Connections } from 'typeorm.data-source';

const connectionName = process.env.APP_DB_CONNECTION_NAME ?? 'default';
if (Connections[connectionName] == undefined) {
  throw new Error('connection name not exists in data-source file');
}
const datasource = new DataSource(Connections[connectionName]); // config is one that is defined in datasource.config.ts file
datasource.initialize();
export default datasource;
