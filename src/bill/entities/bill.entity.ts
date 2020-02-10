import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional }                                     from '@nestjs/swagger';
import { ShopEntity }                                                                     from '../../shop/entities/shop.entity';
import { UserEntity }                                                                     from '../../user/entities/user.entity';
import { PurchaseEntity }                                                                 from '../../purchase/entities/purchase.entity';
import { BillRequestEntity }                                                              from '../../bill-request/entities/bill-request.entity';

@Entity()
export class BillEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  comment?: string;

  @ApiModelProperty()
  @Column({
    type: 'real',
    default: 0,
  })
  totalSum!: number;

  @ApiModelProperty({
    type: String,
    format: 'date-time',
  })
  @Column()
  billDate!: Date;

  @ApiModelProperty()
  @Column()
  shopId!: string;

  @ManyToOne(() => ShopEntity, shop => shop.bills, { onDelete: 'RESTRICT' })
  shop?: ShopEntity;

  @ApiModelProperty()
  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, user => user.bills, { onDelete: 'RESTRICT' })
  user?: UserEntity;

  @OneToMany(() => PurchaseEntity, purchase => purchase.bill)
  purchases?: PurchaseEntity[];

  @OneToMany(() => BillRequestEntity, billRequest => billRequest.bill)
  billRequests?: BillRequestEntity[];

  @ApiModelProperty({
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt!: Date;
}
