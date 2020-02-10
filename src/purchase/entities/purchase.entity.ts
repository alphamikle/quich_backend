import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty }                                  from '@nestjs/swagger';
import { ProductEntity }                                     from '../../product/entities/product.entity';
import { BillEntity }                                        from '../../bill/entities/bill.entity';
import { CategoryEntity }                                    from '../../category/entities/category.entity';

@Entity()
export class PurchaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiModelProperty({ format: 'double' })
  @Column({ type: 'real' })
  price!: number;

  @ApiModelProperty({ format: 'double' })
  @Column({ type: 'real' })
  quantity!: number;

  @ApiModelProperty({ format: 'double' })
  @Column({
    type: 'float',
    nullable: true,
  })
  rate!: number;

  @ApiModelProperty()
  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, product => product.purchases)
  product?: ProductEntity;

  @ApiModelProperty()
  @Column()
  categoryId!: string;

  @ManyToOne(() => CategoryEntity, category => category.purchases, { onDelete: 'RESTRICT' })
  category?: CategoryEntity;

  @ApiModelProperty()
  @Column()
  billId!: string;

  @ManyToOne(() => BillEntity, bill => bill.purchases, { onDelete: 'CASCADE' })
  bill?: BillEntity;

  @ApiModelProperty({
    type: String,
    format: 'date-time',
  })
  @Column({ default: () => 'now()' })
  createdAt!: Date;
}
