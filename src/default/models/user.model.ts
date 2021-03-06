import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartModel }                                                           from './cart.model';
import { CategoryModel }                                                       from './category.model';
import { CartRequestModel }                                                    from './cartRequest.model';
import { FtsAccountModel }                                                     from './ftsAccount.model';

@Entity({ name: 'user' })
export class UserModel {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  code: string;

  @OneToMany(() => CartModel, check => check.user)
  checks: CartModel[];

  @OneToMany(() => CategoryModel, category => category.user)
  categories: CategoryModel[];

  @OneToMany(() => CartRequestModel, request => request.user)
  requests: CartRequestModel[];

  @OneToMany(() => FtsAccountModel, account => account.user)
  ftsAccounts: FtsAccountModel[];

  @CreateDateColumn()
  createdAt: Date;
}
