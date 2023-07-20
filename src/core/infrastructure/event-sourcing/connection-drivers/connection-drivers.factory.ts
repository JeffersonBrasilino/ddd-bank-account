import { IConnectionDriver } from './IConnection-driver';
import { rabbitmqConfigProps, RabbitmqConnectionDriver } from './rabbitmq-connection.driver';

const connectionDrivers = {
  rmq: RabbitmqConnectionDriver,
};

export type configProps = rabbitmqConfigProps;
export type connectionDriversKind = keyof typeof connectionDrivers;
export class ConnectionDriversFactory {
  static create(driver: connectionDriversKind, config: configProps): IConnectionDriver {
    if (!connectionDrivers[driver]) throw new Error('driver de conexao do evento nao encontrado.');

    return connectionDrivers[driver].instance(config as any);
  }
}
