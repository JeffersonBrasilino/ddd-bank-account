import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApplicationsEntity } from './applications.entity';
import { ApiRoutesEntity } from './api-routes.entity';

@Entity('api_routes_applications', { schema: 'auth' })
export class ApiRoutesApplicationsEntity extends TypeormBaseEntity {
  //adicione os campos da tabela aqui.
  @ManyToOne(() => ApplicationsEntity, a => a.id)
  @JoinColumn({ name: 'application_id' })
  application!: ApplicationsEntity;

  @ManyToOne(() => ApiRoutesEntity, ar => ar.id)
  @JoinColumn({ name: 'api_route_id' })
  apiRoute!: ApiRoutesEntity;
}
