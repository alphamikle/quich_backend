import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShopEntity } from '~/shop/entities/shop.entity';
import { User } from '~/user/entities/user';
import { PurchaseEntity } from '~/purchase/entities/purchase.entity';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import * as bill from '~/proto-generated/bill';

@Entity('bill_entity')
export class Bill implements bill.Bill {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  comment?: string;

  @Column({
    type: 'real',
    default: 0,
  })
  totalSum!: number;

  @Column()
  billDate!: Date;

  @Column()
  shopId!: string;

  @ManyToOne(() => ShopEntity, shop => shop.bills, { onDelete: 'RESTRICT' })
  shop?: ShopEntity;

  @Column()
  userId!: string;

  @ManyToOne(() => User, user => user.bills, { onDelete: 'RESTRICT' })
  user?: User;

  @OneToMany(() => PurchaseEntity, purchase => purchase.bill)
  purchases?: PurchaseEntity[];

  @OneToMany(() => BillRequest, billRequest => billRequest.bill)
  billRequests?: BillRequest[];

  @CreateDateColumn()
  createdAt!: Date;
}
