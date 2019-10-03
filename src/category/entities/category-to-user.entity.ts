import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { UserEntity } from '../../user/entities/user.entity';

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
  @ManyToOne(() => UserEntity, user => user.categoriesToUsers, { onDelete: 'CASCADE' })
  user?: UserEntity;
}
