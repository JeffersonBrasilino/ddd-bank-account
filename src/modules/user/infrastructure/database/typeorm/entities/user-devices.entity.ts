import { TypeormBaseEntity } from '@core/infrastructure/database/typeorm/typeorm-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('user_devices', { schema: 'auth' })
export class UserDevicesEntity extends TypeormBaseEntity {
  @Column({
    name: 'device_id',
  })
  deviceId!: string;

  @Column({
    name: 'device_name',
    nullable: true,
  })
  deviceName!: string;

  @Column({
    name: 'auth_token',
  })
  authToken!: string;

  @Column({
    name: 'refresh_token',
  })
  refreshToken!: string;

  @ManyToOne(() => UsersEntity, u => u.id)
  @JoinColumn({ name: 'user_id' })
  user!: UsersEntity;
}
