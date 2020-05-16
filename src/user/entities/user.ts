import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FtsAccountEntity } from './fts-account.entity';
import { Session } from '~/user/entities/session';
import { Bill } from '~/bill/entities/bill';
import { CategoryToUserEntity } from '~/category/entities/category-to-user.entity';
import { BillRequestEntity } from '~/bill-request/entities/bill-request.entity';
import { SubscriptionEntity } from '~/subscription/entities/subscription.entity';
import { MessageEntity } from '~/message/entity/message.entity';
import { UserQueryLimitEntity } from '~/user/entities/user-query-limit.entity';

@Entity('user_entity')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => FtsAccountEntity, account => account.user)
  ftsAccounts?: FtsAccountEntity[];

  @OneToMany(() => Session, session => session.user)
  sessions?: Session[];

  @OneToMany(() => Bill, bill => bill.user)
  bills?: Bill[];

  @OneToMany(() => CategoryToUserEntity, categoryToUser => categoryToUser.user)
  categoriesToUsers?: CategoryToUserEntity[];

  @OneToMany(() => BillRequestEntity, billRequest => billRequest.user)
  billRequests?: BillRequestEntity[];

  @OneToMany(() => SubscriptionEntity, subscription => subscription.user)
  subscriptions?: SubscriptionEntity[];

  @OneToMany(() => MessageEntity, message => message.user)
  messages?: MessageEntity[];

  @OneToMany(() => UserQueryLimitEntity, uses => uses.user)
  queryLimits?: UserQueryLimitEntity[];

  hasPurchase!: boolean;

  queryUses!: number;

  queryUsesLimits!: number;
}
