import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryModel } from './category.model';
import { PurchaseModel } from './purchase.model';

@Entity({ name: 'product' })
export class ProductModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  title: string;

  @Column({ type: 'integer', nullable: true })
  categoryId: number;
  @ManyToOne(type => CategoryModel, category => category.products, { onDelete: 'SET NULL' })
  category: CategoryModel;

  @OneToMany(type => PurchaseModel, purchase => purchase.product)
  purchases: PurchaseModel[];

  @CreateDateColumn()
  createdAt: Date;

}
