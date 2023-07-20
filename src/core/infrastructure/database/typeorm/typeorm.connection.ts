import { Connections } from 'typeorm.data-source';
import { DataSource } from 'typeorm';
export class TypeormConnection {
  private static connectionInstance: DataSource;

  static async connect(name?: string): Promise<DataSource> {
    const connectionName = name ?? 'default';
    if (Connections[connectionName] == undefined) {
      throw new Error('connection name not exists in data-source file');
    }
    TypeormConnection.connectionInstance = await new DataSource(
      Connections[connectionName],
    ).initialize();
    return TypeormConnection.connectionInstance;
  }

  static getConnection(): DataSource {
    return TypeormConnection.connectionInstance;
  }
}
