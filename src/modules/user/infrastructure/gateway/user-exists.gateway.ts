import { ErrorFactory } from '@core/domain/errors';
import { HttpClientInterface } from '@core/infrastructure/http/http-client';
import { UserExistsGatewayInterface } from '@module/user/domain/contracts/user-exists.gateway.interface';
import { UserMapper } from '@module/user/mapper/user.mapper';

export class UserExistsGateway implements UserExistsGatewayInterface {
  public constructor(
    private mapper: UserMapper,
    private client: HttpClientInterface,
  ) {}
  async getByCpf(cpf: string | number) {
    try {
      const res = await this.client.get<Record<string, any>>(
        `/profissional/cpf/${cpf}/details`,
      );

      if (
        res.status == 404 ||
        res.data.results == undefined ||
        res.data.results.length == 0
      ) {
        return ErrorFactory.create('notFound', 'usuario nao encontrado');
      }
      const userData = res.data.results[0];
      return this.mapper.toDomain({
        username: userData.cpf,
        password: null,
        person: {
          cpf: userData.cpf,
          name: userData.profissional_nome,
          birthDate: userData.dt_nascimento,
          contacts: [
            {
              description: userData.email,
              contactType: { id: 1 },
            },
            { description: userData.telefone, contactType: { id: 2 } },
          ],
        },
      });
    } catch (e) {
      console.log(e);
      return ErrorFactory.create(
        'Dependency',
        'error getting user from gateway',
      );
    }
  }
}
