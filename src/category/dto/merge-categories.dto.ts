import * as category from '~/proto-generated/category';

export class MergeCategoriesDto implements category.MergeCategoriesDto {
  donorId!: string;

  recipientId!: string;
}