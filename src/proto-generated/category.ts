import { Metadata } from 'grpc';
/* eslint-disable */
import { Empty } from './google/protobuf/empty';


export interface Categories {
  categories: CategoryDto[];
}

export interface CategoryDto {
  id?: string;
  title: string;
  color: number;
}

export interface CategoryIdDto {
  categoryId: string;
}

export interface MergeCategoriesDto {
  donorId: string;
  recipientId: string;
}

export interface CategoryController {

  getUserCategories(request: Empty, meta: Metadata): Promise<Empty>;

  createCategory(request: CategoryDto, meta: Metadata): Promise<CategoryDto>;

  editCategory(request: CategoryDto, meta: Metadata): Promise<CategoryDto>;

  deleteCategory(request: CategoryIdDto, meta: Metadata): Promise<Empty>;

  mergeCategories(request: MergeCategoriesDto, meta: Metadata): Promise<Empty>;

}
