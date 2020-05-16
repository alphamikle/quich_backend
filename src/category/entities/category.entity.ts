import 'reflect-metadata';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { CategoryToUserEntity } from './category-to-user.entity';

@Entity()
export class CategoryEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column()
  title!: string;

  @OneToMany(() => PurchaseEntity, purchase => purchase.category)
  purchases?: PurchaseEntity[];

  @OneToMany(() => CategoryToUserEntity, categoryToUser => categoryToUser.category)
  categoriesToUsers?: CategoryToUserEntity[];
}
