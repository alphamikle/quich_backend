import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShopEntity } from '../../shop/entities/shop.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { BillRequestEntity } from '../../bill-request/entities/bill-request.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class BillEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  comment?: string;

  @ApiModelProperty()
  @Column({ type: 'real', default: 0 })
  totalSum!: number;

  @ApiModelProperty()
  @Column()
  billDate!: Date;

  @ApiModelProperty()
  @Column()
  shopId!: string;
  @ApiModelProperty()
  @ManyToOne(() => ShopEntity, shop => shop.bills, { onDelete: 'RESTRICT' })
  shop?: ShopEntity;

  @ApiModelProperty()
  @Column()
  userId!: string;
  @ApiModelProperty()
  @ManyToOne(() => UserEntity, user => user.bills, { onDelete: 'RESTRICT' })
  user?: UserEntity;

  @ApiModelProperty()
  @OneToMany(() => PurchaseEntity, purchase => purchase.bill)
  purchases?: PurchaseEntity[];

  @ApiModelProperty()
  @OneToMany(() => BillRequestEntity, billRequest => billRequest.bill)
  billRequests?: BillRequestEntity[];

  @ApiModelProperty()
  @CreateDateColumn()
  createdAt!: Date;
}
