import { ErrorFactory } from '@core/domain/errors';
import { UserExistsGatewayInterface } from '@module/user/domain/contracts/user-exists.gateway.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';

export class UserExistsGateway implements UserExistsGatewayInterface {
  public constructor(private mapper: UserMapper) {}
  async getByCpf(cpf: string | number) {
    try {
      if (cpf == '83390395806') {
        const rawData = {
          cpf: '83390395806',
          nome: 'Pedro Henrique Fábio Osvaldo da Paz',
          email: 'pedro.henrique.dapaz@imobideal.com',
          data_nasc: new Date(1972, 1, 1),
          celular: '83998916031',
        };

        return this.mapper.toDomain({
          username: rawData.cpf,
          password: null,
          person: {
            cpf: rawData.cpf,
            name: rawData.nome,
            birthDate: rawData.data_nasc,
            contacts: [
              {
                description: rawData.email,
                contactType: { id: 1 },
              },
              { description: '83998916031', contactType: { id: 2 } },
            ],
          },
        });
      }
      return ErrorFactory.instance().create(
        'notFound',
        'usuario nao encontrado',
      );
    } catch (e) {
      return ErrorFactory.instance().create(
        'InternalError',
        'error getting user from gateway',
      );
    }
  }
}
