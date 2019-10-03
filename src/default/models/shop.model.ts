import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartModel } from './cart.model';

@Entity({ name: 'shop' })
export class ShopModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  retailPlace: string;

  @Column({ nullable: true })
  retailPlaceAddress: string;

  @Column({ nullable: true })
  kktRegId: string;

  @Column({ nullable: true })
  userInn: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(type => CartModel, check => check.shop)
  checks: CartModel[];

}
