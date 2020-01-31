import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartModel } from './cart.model';
import { ProductModel } from './product.model';

@Entity({ name: 'purchase' })
export class PurchaseModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'real', nullable: false })
  quantity: number;

  @Column({ type: 'real', nullable: true })
  discount: number;

  @Column({ type: 'real', nullable: true })
  rating: number;

  @Column({ type: 'integer' })
  productId: number;

  @ManyToOne(type => ProductModel, product => product.purchases, { onDelete: 'CASCADE' })
  product: ProductModel;

  @Column({ type: 'integer' })
  checkId: number;

  @ManyToOne(type => CartModel, check => check.purchases, { onDelete: 'CASCADE' })
  check: CartModel;

  @Column()
  createdAt: Date;
}
