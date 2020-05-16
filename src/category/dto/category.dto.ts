import 'reflect-metadata';
import * as category from '~/proto-generated/category';

export class CategoryDto implements category.CategoryDto {

  id?: string;

  title!: string;

  color!: number;
}
