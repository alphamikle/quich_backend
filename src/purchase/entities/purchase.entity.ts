import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '~/product/entities/product.entity';
import { Bill } from '~/bill/entities/bill.entity';
import { Category } from '~/category/entities/category.entity';
import * as purchase from '~/proto-generated/purchase';

@Entity('purchase_entity')
export class Purchase implements purchase.Purchase {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'real' })
  price!: number;

  @Column({ type: 'real' })
  quantity!: number;

  @Column({ type: 'float', nullable: true })
  rate?: number;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, product => product.purchases)
  product?: Product;

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
