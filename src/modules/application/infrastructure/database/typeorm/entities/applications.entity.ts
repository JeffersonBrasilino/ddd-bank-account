import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiRoutesApplicationsEntity } from './api-routes-applications.entity';

@Entity('applications', { schema: 'auth' })
export class ApplicationsEntity extends TypeormBaseEntity {
  //adicione os campos da tabela aqui.
  @Column({ comment: 'descricao da aplicacao' })
  description!: string;

  @Column({
    name: 'public_key',
    comment: 'chave publica que sera disponibilizado para a aplicacao(oauth)',
  })
  publicKey!: string;

  @Column({
    name: 'private_key',
    comment: 'chave privada que sera disponibilizado para a aplicacao(oauth)',
  })
  privateKey!: string;

  @Column({
    name: 'third_party_application',
    comment:
      'identifica se a aplicação é uma aplicação de terceiro. 1 - sim 0 - não',
  })
  thirdPartyApplication!: string;

  @OneToMany(() => ApiRoutesApplicationsEntity, ara => ara.application)
  apiRoutes!: ApiRoutesApplicationsEntity[];
}
