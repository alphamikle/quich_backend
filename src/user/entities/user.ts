import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FtsAccount } from './fts-account.entity';
import { Session } from '~/user/entities/session';
import { Bill } from '~/bill/entities/bill.entity';
import { CategoryToUserRel } from '~/category/entities/category-to-user-rel.entity';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
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

  @OneToMany(() => FtsAccount, account => account.user)
  ftsAccounts?: FtsAccount[];

  @OneToMany(() => Session, session => session.user)
  sessions?: Session[];

  @OneToMany(() => Bill, bill => bill.user)
  bills?: Bill[];

  @OneToMany(() => CategoryToUserRel, categoryToUser => categoryToUser.user)
  categoriesToUsers?: CategoryToUserRel[];

  @OneToMany(() => BillRequest, billRequest => billRequest.user)
  billRequests?: BillRequest[];

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
