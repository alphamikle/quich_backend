import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  title!: string;

  @OneToMany(() => PurchaseEntity, purchase => purchase.product)
  purchases?: PurchaseEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}
