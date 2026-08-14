import { DataSource } from 'typeorm';
export class TypeormConnection {
  private static connectionInstance: DataSource;

  constructor(private config: object) {}

  async connect(name?: string): Promise<DataSource> {
    const connectionName = name ?? 'default';
    if (this.config[connectionName] == undefined) {
      throw new Error('connection name not exists in data-source file');
    }
    TypeormConnection.connectionInstance = await new DataSource(
      this.config[connectionName],
    ).initialize();
    return TypeormConnection.connectionInstance;
  }

  static getConnection(): DataSource {
    return TypeormConnection.connectionInstance;
  }
}
