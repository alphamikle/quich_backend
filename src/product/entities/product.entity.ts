import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from '~/purchase/entities/purchase.entity';
import * as product from '~/proto-generated/product';

@Entity('product_entity')
export class Product implements product.Product {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  title!: string;

  @OneToMany(() => Purchase, purchase => purchase.product)
  purchases?: Purchase[];

  @Column({ default: () => 'now()' })
  createdAt!: Date;
}
