import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.model';
import { ProductModel } from './product.model';

@Entity({ name: 'category' })
export class CategoryModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  title: string;

  @Column({ type: 'bigint' })
  color: number;

  @Column({ type: 'integer' })
  userId: number;
  @ManyToOne(type => UserModel, user => user.categories, { onDelete: 'CASCADE' })
  user: UserModel;

  @OneToMany(type => ProductModel, product => product.category)
  products: ProductModel[];

  @CreateDateColumn()
  createdAt: Date;

}
