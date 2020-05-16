import 'reflect-metadata';
import { CategoryDto } from '~/category/dto/category.dto';
import * as category from '~/proto-generated/category';

export class Categories implements category.Categories {
  constructor(public categories: CategoryDto[]) {
  }
}