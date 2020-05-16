import 'reflect-metadata';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '~/category/entities/category.entity';
import { User } from '~/user/entities/user';

@Entity('category_to_user_entity')
export class CategoryToUserRel {
  static BLACK_COLOR = 4278190080;

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('bigint')
  color!: number;

  @Column()
  categoryId!: string;

  @ManyToOne(() => Category, category => category.categoriesToUsers, { onDelete: 'RESTRICT' })
  category?: Category;

  @Column()
  userId!: string;

  @ManyToOne(() => User, user => user.categoriesToUsers, { onDelete: 'CASCADE' })
  user?: User;
}
