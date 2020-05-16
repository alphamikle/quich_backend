import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { Bill } from '../../bill/entities/bill.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class PurchaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column({ type: 'real' })
  price!: number;


  @Column({ type: 'real' })
  quantity!: number;


  @Column({
    type: 'float',
    nullable: true,
  })
  rate!: number;


  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, product => product.purchases)
  product?: ProductEntity;


  @Column()
  categoryId!: string;

  @ManyToOne(() => Category, category => category.purchases, { onDelete: 'RESTRICT' })
  category?: Category;


  @Column()
  billId!: string;

  @ManyToOne(() => Bill, bill => bill.purchases, { onDelete: 'CASCADE' })
  bill?: Bill;

  @Column({ default: () => 'now()' })
  createdAt!: Date;
}
