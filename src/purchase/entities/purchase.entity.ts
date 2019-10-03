import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { BillEntity } from '../../bill/entities/bill.entity';
import { CategoryEntity } from '../../category/entities/category.entity';

@Entity()
export class PurchaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'real' })
  price!: number;

  @Column({ type: 'real' })
  quantity!: number;

  @Column({ type: 'float', nullable: true })
  rate!: number;

  @Column()
  productId!: string;
  @ManyToOne(() => ProductEntity, product => product.purchases)
  product?: ProductEntity;

  @Column()
  categoryId!: string;
  @ManyToOne(() => CategoryEntity, category => category.purchases, { onDelete: 'RESTRICT' })
  category?: CategoryEntity;

  @Column()
  billId!: string;
  @ManyToOne(() => BillEntity, bill => bill.purchases, { onDelete: 'CASCADE' })
  bill?: BillEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
