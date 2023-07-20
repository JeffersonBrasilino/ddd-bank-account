import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { Subject } from 'rxjs';
import { IConnectionDriver } from './IConnection-driver';

export type rabbitmqConfigProps = {
  name: string;
  url: string;
  queue: string;
  configOptions?: { durable: boolean; noAck: boolean };
};

export class RabbitmqConnectionDriver implements IConnectionDriver {
  private static connectionsInstance: Map<string, RabbitmqConnectionDriver> = new Map();
  private clientInstance: ChannelWrapper;

  private constructor(private config: rabbitmqConfigProps) {
    this.validateConfig(config);
    this.connect(config);
  }

  static instance(config: rabbitmqConfigProps) {
    let instance: RabbitmqConnectionDriver = RabbitmqConnectionDriver.connectionsInstance.get(config.name);

    if (!instance) {
      instance = new RabbitmqConnectionDriver(config);
      RabbitmqConnectionDriver.connectionsInstance.set(config.name, instance);
    }
    return instance;
  }

  private connect(config: rabbitmqConfigProps) {
    this.clientInstance = connect(config.url).createChannel({
      json: true,
      name: this.config.queue,
      setup: function (channel) {
        return Promise.all([
          channel.assertQueue(config.queue, {
            durable: config?.configOptions?.durable ?? true,
            noAck: config?.configOptions?.durable ?? true,
          }),
        ]);
      },
    });
  }

  private validateConfig(config: rabbitmqConfigProps): void {
    if (!config.url) throw new Error('url de conexao invalida.');
    if (!config.queue) throw new Error('fila(queue) de conexao invalida.');
  }

  async send(pattern: string, data: string) {
    try {
      await this.clientInstance.sendToQueue(this.config.queue, { pattern, data });
    } catch (e) {
      console.log('ERRO AO ENVIAR PARA FILA', e);
    }
  }

  subscribe(events: any[], subject: Subject<any>) {
    try {
      this.clientInstance.consume(this.config.queue, (data) => {
        const receivedData = data.content.toString() ? JSON.parse(data.content.toString()) : undefined;
        if (receivedData) {
          for (const event of events) {
            if (event && event.name == receivedData.pattern) {
              subject.next(new event(receivedData.data));
              this.clientInstance.ack(data);
            }
          }
        }
      });
    } catch (e) {
      console.log('erro ao se inscrever na fila ', e);
    }
  }
}
