import {
  Connection,
  createConnection,
  createConnections,
  getConnection,
  getConnectionManager,
} from 'typeorm';


const ormConfig = require('.././../../../ormconfig.js');

export class TypeormConnection {
  private static CONNECTION_NAME =
    process.env.APP_DB_CONNECTION_NAME ?? 'default';

  static async connect(name?: string): Promise<Connection> {
    await createConnections(ormConfig);

    return this.getConnection(name);
  }

  static getConnection(connectionName?: string): Connection {
    connectionName = connectionName ?? this.CONNECTION_NAME;
    const ormConfigIndex = ormConfig.findIndex(
      (oc) => (oc.name = connectionName),
    );
    if (ormConfigIndex !== -1) {
      return getConnection(connectionName);
    } else {
      throw `CONEXÃO ${connectionName} NÃO EXISTE NO ARQUIVO ormconfig.js`;
    }
  }
}
