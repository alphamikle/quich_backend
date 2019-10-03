import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FtsAccountEntity } from './fts-account.entity';
import { SessionEntity } from './session.entity';
import { BillEntity } from '../../bill/entities/bill.entity';
import { CategoryToUserEntity } from '../../category/entities/category-to-user.entity';
import { BillRequestEntity } from '../../bill-request/entities/bill-request.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class UserEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column()
  email!: string;

  @ApiModelProperty()
  @Column()
  password!: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => FtsAccountEntity, account => account.user)
  ftsAccounts?: FtsAccountEntity[];

  @OneToMany(() => SessionEntity, session => session.user)
  sessions?: SessionEntity[];

  @OneToMany(() => BillEntity, bill => bill.user)
  bills?: BillEntity[];

  @OneToMany(() => CategoryToUserEntity, categoryToUser => categoryToUser.user)
  categoriesToUsers?: CategoryToUserEntity[];

  @OneToMany(() => BillRequestEntity, billRequest => billRequest.user)
  billRequests?: BillRequestEntity[];
}
