import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user';
import { GooglePlayHookDto } from '../dto/google-play-hook.dto';
import { GooglePlaySubscriptionInfo } from '../interface/google-api.interface';

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

export enum Status {
  SUBSCRIPTION_RECOVERED = 1,
  SUBSCRIPTION_RENEWED,
  SUBSCRIPTION_CANCELED,
  SUBSCRIPTION_PURCHASED,
  SUBSCRIPTION_ON_HOLD,
  SUBSCRIPTION_IN_GRACE_PERIOD,
  SUBSCRIPTION_RESTARTED,
  SUBSCRIPTION_PRICE_CHANGE_CONFIRMED,
  SUBSCRIPTION_DEFERRED,
  SUBSCRIPTION_PAUSED,
  SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED,
  SUBSCRIPTION_REVOKED,
  SUBSCRIPTION_EXPIRED,
}

export enum Sku {
  // ? Test subs
  TEST_MONTHLY_SUBSCRIPTION = 'test_monthly_subscription',
  TEST_YEARLY_SUBSCRIPTION = 'test_yearly_subscription',
  // ? Prod subs
  COFFEE_CUP_SUBSCRIPTION = 'coffe_cup',
  BREAKFAST_SUBSCRIPTION = 'breakfast',
  KILO_BEEF_SUBSCRIPTION = 'kilo_beef',
  // ? Promo subs
  FIRST_THREE_DAYS = 'first_three_days',
}

@Entity()
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, user => user.subscriptions, { nullable: true })
  user?: User;

  @Column({
    type: 'enum',
    enum: Platform,
    default: Platform.ANDROID,
  })
  platform!: Platform;

  @Column({
    type: 'enum',
    enum: Market,
    default: Market.GOOGLE_PLAY,
  })
  market!: Market;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status!: Status;

  @Column({
    type: 'enum',
    enum: Sku,
    default: Sku.COFFEE_CUP_SUBSCRIPTION,
  })
  sku!: Sku;

  @Column()
  purchaseToken!: string;

  @Column()
  orderId!: string;

  @Column({ type: 'real' })
  price!: number;

  @Column({ default: () => 'now()' })
  activeFrom!: Date;

  @Column()
  activeTo!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb' })
  hookRawBody!: GooglePlayHookDto;

  @Column({ type: 'jsonb' })
  subscriptionInfoRawBody!: GooglePlaySubscriptionInfo;

  @Column({ default: () => 'now()' })
  createdAt!: Date;
}
