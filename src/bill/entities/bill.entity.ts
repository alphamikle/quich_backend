import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShopEntity } from '../../shop/entities/shop.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { BillRequestEntity } from '../../bill-request/entities/bill-request.entity';

@Entity()
export class BillEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  comment?: string;

  @Column({ type: 'real', default: 0 })
  totalSum!: number;

  @Column()
  billDate!: Date;

  @Column()
  shopId!: string;
  @ManyToOne(() => ShopEntity, shop => shop.bills, { onDelete: 'RESTRICT' })
  shop?: ShopEntity;

  @Column()
  userId!: string;
  @ManyToOne(() => UserEntity, user => user.bills, { onDelete: 'RESTRICT' })
  user?: UserEntity;

  @OneToMany(() => PurchaseEntity, purchase => purchase.bill)
  purchases?: PurchaseEntity[];

  @OneToMany(() => BillRequestEntity, billRequest => billRequest.bill)
  billRequests?: BillRequestEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}
