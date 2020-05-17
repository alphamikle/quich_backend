import { BadRequestException, Controller } from '@nestjs/common';
import { Metadata } from 'grpc';
import { CategoryService } from '~/category/category.service';
import { RequestUser } from '~/user/user.decorator';
import { User } from '~/user/entities/user.entity';
import { CategoryDto } from '~/category/dto/category.dto';
import { CATEGORY_NOT_EXIST_ERROR, CATEGORY_TITLE_DOUBLE_ERROR } from '~/helpers/text';
import { PurchaseService } from '~/purchase/purchase.service';
import { securedGrpc } from '~/providers/decorators';
import * as category from '~/proto-generated/category';
import { CategoryIdDto } from '~/category/dto/category-id.dto';
import { Empty } from '~/providers/empty';
import { MergeCategoriesDto } from '~/category/dto/merge-categories.dto';

@Controller()
export class CategoryController implements category.CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly purchaseService: PurchaseService,
  ) {
  }

  @securedGrpc
  async getUserCategories(@RequestUser() user: User): Promise<CategoryDto[]> {
    return this.categoryService.getUserCategories(user.id);
  }

  @securedGrpc
  async createCategory(request: CategoryDto, { user }: Metadata): Promise<CategoryDto> {
    const existCategory = await this.categoryService.getCategoryForUserByTitle({
      title: request.title,
      userId: user.id,
    });
    if (existCategory) {
      throw new BadRequestException({ title: CATEGORY_TITLE_DOUBLE_ERROR });
    }
    return this.categoryService.createCategoryForUserId({
      categoryDto: request,
      userId: user.id,
    });
  }

  @securedGrpc
  async editCategory(request: CategoryDto, { user }: Metadata): Promise<CategoryDto> {
    const existCategory = await this.categoryService.getCategoryEntityById(request.id);
    if (!existCategory) {
      throw new BadRequestException({ push: CATEGORY_NOT_EXIST_ERROR });
    }
    const categoryByTitle = await this.categoryService.getCategoryForUserByTitle({
      title: request.title,
      userId: user.id,
    });
    if (categoryByTitle && categoryByTitle.title !== existCategory.title) {
      throw new BadRequestException({ title: CATEGORY_TITLE_DOUBLE_ERROR });
    }
    const editedCategory = await this.categoryService.editCategory({
      categoryDto: request,
      userId: user.id,
    });
    await this.purchaseService.updateUserPurchasesCategoryId({
      oldCategoryId: request.id,
      newCategoryId: editedCategory.id,
      userId: user.id,
    });
    return editedCategory;
  }

  @securedGrpc
  async deleteCategory({ categoryId }: CategoryIdDto, { user }: Metadata): Promise<Empty> {
    const existCategory = await this.categoryService.getCategoryEntityById(categoryId);
    if (!existCategory) {
      throw new BadRequestException({ push: CATEGORY_NOT_EXIST_ERROR });
    }
    await this.categoryService.deleteCategoryFromUser({
      categoryId,
      userId: user.id,
    });
    return new Empty();
  }

  @securedGrpc
  async mergeCategories({ donorId, recipientId }: MergeCategoriesDto, { user }: Metadata): Promise<Empty> {
    await this.purchaseService.updateUserPurchasesCategoryId({
      oldCategoryId: donorId,
      newCategoryId: recipientId,
      userId: user.id,
    });
    await this.categoryService.deleteCategoryFromUser({
      categoryId: donorId,
      userId: user.id,
    });
    return new Empty();
  }
}
