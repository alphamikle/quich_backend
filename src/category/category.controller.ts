import { BadRequestException, Body, Param }                                                                         from '@nestjs/common';
import { CategoryService }                                                                                          from './category.service';
import { RequestUser }                                                                                              from '../user/user.decorator';
import { UserEntity }                                                                                               from '../user/entities/user.entity';
import { CategoryDto }                                                                                              from './dto/category.dto';
import { CATEGORY_NOT_EXIST_ERROR, CATEGORY_TITLE_DOUBLE_ERROR, OK }                                                from '../helpers/text';
import { PurchaseService }                                                                                          from '../purchase/purchase.service';
import { SecureDeleteAction, SecureGetAction, SecurePatchAction, SecurePostAction, SecurePutAction, TagController } from '../helpers/decorators';

@TagController('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly purchaseService: PurchaseService,
  ) {
  }

  @SecureGetAction('Получение списка категорий пользователя', [CategoryDto])
  async getUserCategories(@RequestUser() user: UserEntity): Promise<CategoryDto[]> {
    return this.categoryService.getUserCategories(user.id);
  }

  @SecurePostAction('Создание категории для пользователя', CategoryDto)
  async createCategory(@RequestUser() user: UserEntity, @Body() categoryDto: CategoryDto): Promise<CategoryDto> {
    const existCategory = await this.categoryService.getCategoryForUserByTitle({
      title: categoryDto.title,
      userId: user.id,
    });
    if (existCategory) {
      throw new BadRequestException({ title: CATEGORY_TITLE_DOUBLE_ERROR });
    }
    return this.categoryService.createCategoryForUserId({
      categoryDto,
      userId: user.id,
    });
  }

  @SecurePatchAction('Редактирование категории пользователя', CategoryDto, ':categoryId')
  async editCategory(@RequestUser() user: UserEntity, @Body() categoryDto: CategoryDto, @Param('categoryId') categoryId: string): Promise<CategoryDto> {
    const existCategory = await this.categoryService.getCategoryEntityById(categoryId);
    if (!existCategory) {
      throw new BadRequestException({ push: CATEGORY_NOT_EXIST_ERROR });
    }
    const categoryByTitle = await this.categoryService.getCategoryForUserByTitle({
      title: categoryDto.title,
      userId: user.id,
    });
    if (categoryByTitle && categoryByTitle.title !== existCategory.title) {
      throw new BadRequestException({ title: CATEGORY_TITLE_DOUBLE_ERROR });
    }
    const category = await this.categoryService.editCategory({
      categoryDto,
      userId: user.id,
    });
    await this.purchaseService.updateUserPurchasesCategoryId({
      oldCategoryId: categoryDto.id,
      newCategoryId: category.id,
      userId: user.id,
    });
    return category;
  }

  @SecureDeleteAction('Удаление категории пользователя', String, ':categoryId')
  async deleteCategory(@RequestUser() user: UserEntity, @Param('categoryId') categoryId: string): Promise<string> {
    const existCategory = await this.categoryService.getCategoryEntityById(categoryId);
    if (!existCategory) {
      throw new BadRequestException({ push: CATEGORY_NOT_EXIST_ERROR });
    }
    await this.categoryService.deleteCategoryFromUser({
      categoryId,
      userId: user.id,
    });
    return OK;
  }

  @SecurePutAction('Объединение категорий', String, ':recipientId/:donorId')
  async mergeCategories(@RequestUser() user: UserEntity, @Param('recipientId') recipientId: string, @Param('donorId') donorId: string): Promise<string> {
    await this.purchaseService.updateUserPurchasesCategoryId({
      oldCategoryId: donorId,
      newCategoryId: recipientId,
      userId: user.id,
    });
    await this.categoryService.deleteCategoryFromUser({
      categoryId: donorId,
      userId: user.id,
    });
    return OK;
  }
}
