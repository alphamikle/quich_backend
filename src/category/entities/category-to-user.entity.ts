import 'reflect-metadata';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { User } from '../../user/entities/user';

@Entity()
export class CategoryToUserEntity {
  static BLACK_COLOR = 4278190080;


  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column('bigint')
  color!: number;


  @Column()
  categoryId!: string;

  @ManyToOne(() => CategoryEntity, category => category.categoriesToUsers, { onDelete: 'RESTRICT' })
  category?: CategoryEntity;


  @Column()
  userId!: string;

  @ManyToOne(() => User, user => user.categoriesToUsers, { onDelete: 'CASCADE' })
  user?: User;
}
