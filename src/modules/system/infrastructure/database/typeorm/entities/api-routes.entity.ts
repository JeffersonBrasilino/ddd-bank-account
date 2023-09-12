import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiRoutesApplicationsEntity } from './api-routes-applications.entity';

@Entity('api_routes', { schema: 'auth' })
export class ApiRoutesEntity extends TypeormBaseEntity {
  //adicione os campos da tabela aqui.
  @Column({ comment: 'rota da api' })
  route!: string;

  @OneToMany(() => ApiRoutesApplicationsEntity, ara => ara.apiRoute)
  applications!: ApiRoutesApplicationsEntity[];
}
