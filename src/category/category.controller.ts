import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Guards } from '../helpers/guards';
import { RequestUser } from '../user/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryDto } from './dto/category.dto';
import { wrapErrors } from '../helpers/response.helper';
import { CATEGORY_NOT_EXIST_ERROR, CATEGORY_TITLE_DOUBLE_ERROR, OK } from '../helpers/text';
import { strict } from 'assert';
import { PurchaseService } from '../purchase/purchase.service';

@ApiUseTags('category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly purchaseService: PurchaseService,
  ) {
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ title: 'Получение списка категорий пользователя' })
  @ApiResponse({
    status: 200,
    type: CategoryDto,
    isArray: true,
  })
  async getUserCategories(@RequestUser() user: UserEntity): Promise<CategoryDto[]> {
    return await this.categoryService.getUserCategories(user.id);
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ title: 'Создание категории для пользователя' })
  @ApiResponse({
    status: 200,
    type: CategoryDto,
  })
  async createCategory(@RequestUser() user: UserEntity, @Body() categoryDto: CategoryDto): Promise<CategoryDto> {
    const existCategory = await this.categoryService.getCategoryForUserByTitle({ title: categoryDto.title, userId: user.id });
    if (existCategory) {
      throw new BadRequestException(wrapErrors({ title: CATEGORY_TITLE_DOUBLE_ERROR }));
    }
    return await this.categoryService.createCategoryForUserId({ categoryDto, userId: user.id });
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Patch(':categoryId')
  @ApiOperation({ title: 'Редактирование категории пользователя' })
  @ApiResponse({
    status: 200,
    type: CategoryDto,
  })
  async editCategory(
    @RequestUser() user: UserEntity,
    @Body() categoryDto: CategoryDto,
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryDto> {
    const existCategory = await this.categoryService.getCategoryEntityById(categoryId);
    if (!existCategory) {
      throw new BadRequestException(wrapErrors({ push: CATEGORY_NOT_EXIST_ERROR }));
    }
    const categoryByTitle = await this.categoryService.getCategoryForUserByTitle({ title: categoryDto.title, userId: user.id });
    if (categoryByTitle && categoryByTitle.title !== existCategory.title) {
      throw new BadRequestException(wrapErrors({ title: CATEGORY_TITLE_DOUBLE_ERROR }));
    }
    return await this.categoryService.editCategory({ categoryDto, userId: user.id });
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Delete(':categoryId')
  @ApiOperation({ title: 'Удаление категории пользователя' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async deleteCategory(
    @RequestUser() user: UserEntity,
    @Param('categoryId') categoryId: string,
  ): Promise<string> {
    const existCategory = await this.categoryService.getCategoryEntityById(categoryId);
    if (!existCategory) {
      throw new BadRequestException(wrapErrors({ push: CATEGORY_NOT_EXIST_ERROR }));
    }
    await this.categoryService.deleteCategoryFromUser({ categoryId, userId: user.id });
    return OK;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Put(':recipientId/:donorId')
  @ApiOperation({ title: 'Объединение категорий' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async mergeCategories(
    @RequestUser() user: UserEntity,
    @Param('recipientId') recipientId: string,
    @Param('donorId') donorId: string,
  ): Promise<string> {
    await this.purchaseService.updateUserPurchasesCategoryId({ oldCategoryId: donorId, newCategoryId: recipientId, userId: user.id });
    await this.categoryService.deleteCategoryFromUser({ categoryId: donorId, userId: user.id });
    return OK;
  }
}
