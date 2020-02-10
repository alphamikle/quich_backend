import 'reflect-metadata';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartModel }                                                                                 from './cart.model';
import { UserModel }                                                                                 from './user.model';

@Entity({ name: 'cart_request' })
export class CartRequestModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ unique: true })
  checkUrl: string;

  @Column({
    unique: true,
    nullable: true,
  })
  fetchUrl: string;

  @Column()
  fiscalNumber: string;

  @Column()
  fiscalDocument: string;

  @Column()
  fiscalProp: string;

  @Column()
  hash: string;

  @Column({
    type: 'int',
    default: 0,
  })
  fetchingIterations: number;

  @Column({ default: false })
  isFetched: boolean;

  @Column()
  cartDate: Date;

  @Column({ type: 'real' })
  cartSum: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  cartResult: any;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'integer',
    nullable: true,
  })
  cartId: number;

  @OneToOne(() => CartModel, { onDelete: 'SET NULL' })
  @JoinColumn()
  cart: CartModel;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => UserModel, user => user.requests, { onDelete: 'CASCADE' })
  user: UserModel;

}
