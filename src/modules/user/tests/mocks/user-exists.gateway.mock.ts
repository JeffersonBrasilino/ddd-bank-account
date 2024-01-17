import { ErrorFactory } from '@core/domain/errors';
import { UserExistsGatewayInterface } from '@module/user/domain/contracts/user-exists.gateway.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';

export const UserExistsGatewayMock: jest.Mocked<UserExistsGatewayInterface> = {
  getByCpf: jest.fn(async (cpf: string | number) => {
    try {
      if (cpf == '42108254099') {
        const rawData = {
          cpf: '42108254099',
          nome: 'mockUser',
          email: 'pedro.henrique.dapaz@imobideal.com',
          data_nasc: new Date(1972, 1, 1),
          celular: '83998916031',
        };

        return new UserMapper().toDomain({
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
      return ErrorFactory.create('notFound', 'usuario nao encontrado');
    } catch (e) {
      return ErrorFactory.create('Internal', 'error getting user from gateway');
    }
  }),
};
