import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ShopModel } from './shop.model';
import { UserModel } from './user.model';
import { PurchaseModel } from './purchase.model';

@Entity({ name: 'check' })
export class CartModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'real', nullable: false, default: 0 })
  sumTotal: number;

  @Column()
  checkDate: Date;

  @Column({ type: 'integer', nullable: false })
  shopId: number;

  @ManyToOne(type => ShopModel, shop => shop.checks)
  shop: ShopModel;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @ManyToOne(type => UserModel, user => user.checks, { onDelete: 'CASCADE' })
  user: UserModel;

  @OneToMany(type => PurchaseModel, purchase => purchase.check)
  purchases: PurchaseModel[];

  @CreateDateColumn()
  createdAt: Date;

}
