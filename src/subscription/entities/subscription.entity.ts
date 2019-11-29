import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { GooglePlayHookDto } from '../dto/google-play-hook.dto';

export enum Platform {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  ALL = 'ALL',
}

export enum Market {
  APP_STORE = 'APP_STORE',
  GOOGLE_PLAY = 'GOOGLE_PLAY',
  WEB_SITE = 'WEB_SITE',
}

@Entity()
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;
  @ManyToOne(() => UserEntity, user => user.subscriptions)
  user?: UserEntity;

  @Column({ type: 'enum', enum: Platform, default: Platform.ANDROID })
  platform!: Platform;

  @Column({ type: 'enum', enum: Market, default: Market.GOOGLE_PLAY })
  market!: Market;

  @Column()
  subscriptionId!: string;

  @Column({ type: 'real' })
  price!: number;

  @Column({ default: () => 'now()' })
  activeFrom!: Date;

  @Column()
  activeTo!: Date;

  @Column({ nullable: true })
  gracePeriodFrom!: Date;

  @Column({ nullable: true })
  gracePeriodTo!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: () => 'now()' })
  createdAt!: Date;

  @Column({ type: 'jsonb', nullable: true })
  rawBody?: GooglePlayHookDto;
}
