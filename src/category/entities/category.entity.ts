import 'reflect-metadata';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from '~/purchase/entities/purchase.entity';
import { CategoryToUserRel } from '~/category/entities/category-to-user-rel.entity';

@Entity('category_entity')
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @OneToMany(() => Purchase, purchase => purchase.category)
  purchases?: Purchase[];

  @OneToMany(() => CategoryToUserRel, categoryToUser => categoryToUser.category)
  categoriesToUsers?: CategoryToUserRel[];
}
