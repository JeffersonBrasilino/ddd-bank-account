import {
  DataNotFoundError,
  InfrastructureError,
} from '@core/infrastructure/errors';
import { ApplicationGuardDataProviderInterface } from '@core/infrastructure/http/nestjs/guards/application';
import { ApplicationsEntity } from '../typeorm/entities/applications.entity';

export class ApplicationAuthenticationRepository
  implements ApplicationGuardDataProviderInterface
{
  async getApplicationByPublicKey(publicKey: string) {
    try {
      const app = await ApplicationsEntity.findOneBy({ publicKey });
      return app != null
        ? app.uuid
        : new DataNotFoundError('Application not found');
    } catch (e) {
      return new InfrastructureError('error getting application');
    }
  }
}
