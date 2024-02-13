import { ApplicationGuardDataProviderInterface } from '@core/infrastructure/http/nestjs/guards/application';
import { ApplicationsEntity } from '../typeorm/entities/applications.entity';
import { ErrorFactory } from '@core/domain/errors';

export class ApplicationAuthenticationRepository
  implements ApplicationGuardDataProviderInterface
{
  async getApplicationByPublicKey(publicKey: string) {
    const errorFactory = ErrorFactory;
    try {
      const app = await ApplicationsEntity.findOneBy({ publicKey });
      return app != null
        ? app.uuid
        : errorFactory.create('notFound', 'Application not found');
    } catch (e) {
      return errorFactory.create('Internal', 'error getting application');
    }
  }
}
