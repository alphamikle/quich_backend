import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '~/category/entities/category.entity';
import { CategoryToUserRel } from '~/category/entities/category-to-user-rel.entity';
import { CategoryDto } from '~/category/dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryEntityRepository: Repository<Category>,
    @InjectRepository(CategoryToUserRel)
    private readonly categoryToUserEntityRepository: Repository<CategoryToUserRel>,
  ) {
  }

  async getUserCategories(userId: string): Promise<CategoryDto[]> {
    const categories: CategoryDto[] = await this.categoryEntityRepository.query(`
      SELECT ce.id, ce.title, ctue.color FROM category_entity ce
        LEFT JOIN category_to_user_entity ctue on ce.id = ctue."categoryId"
        WHERE ctue."userId" = '${ userId }'
        ORDER BY ce.title
    `);
    return categories.map((category) => {
      category.color = Number(category.color);
      return category;
    });
  }

  async getCategoryForUserById({ categoryId, userId }: { categoryId: string, userId: string }): Promise<CategoryDto> {
    const categories: CategoryDto[] = await this.categoryEntityRepository.query(`
      SELECT ce.id, ce.title, ctue.color::numeric FROM category_entity ce
        LEFT JOIN category_to_user_entity ctue on ce.id = ctue."categoryId"
        WHERE ctue."userId" = '${ userId }' AND ctue."categoryId" = '${ categoryId }'
    `);
    let category: CategoryDto;
    if (categories.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      category = categories[0];
      category.color = Number(category.color);
    }
    return category;
  }

  async getCategoryForUserByTitle({ title, userId }: { title: string, userId: string }): Promise<CategoryDto> {
    const categories: CategoryDto[] = await this.categoryEntityRepository.query(`
      SELECT ce.id, ce.title, ctue.color FROM category_entity ce
        LEFT JOIN category_to_user_entity ctue on ce.id = ctue."categoryId"
        WHERE ctue."userId" = '${ userId }' AND ce."title" = '${ title }'
    `);
    let category: CategoryDto;
    if (categories.length > 0) {
      [category] = categories;
    }
    return category;
  }

  async getCategoryEntityByTitle(title: string): Promise<Category> {
    return this.categoryEntityRepository.findOne({ where: { title } });
  }

  async getCategoryEntityById(id: string): Promise<Category> {
    return this.categoryEntityRepository.findOne(id);
  }

  async createCategoryForUserId({ categoryDto, userId }: { categoryDto: CategoryDto, userId: string }): Promise<CategoryDto> {
    let category: Category = await this.getCategoryEntityByTitle(categoryDto.title);
    if (!category) {
      category = new Category();
      category.title = categoryDto.title;
      category = await this.categoryEntityRepository.save(category);
    }
    let categoryToUserEntity = await this.categoryToUserEntityRepository.findOne({
      where: {
        userId,
        categoryId: category.id,
      },
    });
    if (!categoryToUserEntity) {
      categoryToUserEntity = new CategoryToUserRel();
      categoryToUserEntity.userId = userId;
      categoryToUserEntity.categoryId = category.id;
      categoryToUserEntity.color = categoryDto.color;
      await this.categoryToUserEntityRepository.save(categoryToUserEntity);
    }
    return this.getCategoryForUserById({
      categoryId: category.id,
      userId,
    });
  }

  async changeUserCategoryColor({ categoryDto, userId }: { categoryDto: CategoryDto, userId: string }): Promise<CategoryToUserRel> {
    const categoryToUserEntity = await this.categoryToUserEntityRepository.findOne({
      where: {
        categoryId: categoryDto.id,
        userId,
      },
    });
    categoryToUserEntity.color = categoryDto.color;
    return this.categoryToUserEntityRepository.save(categoryToUserEntity);
  }

  async createCategoryEntity(categoryDto: CategoryDto): Promise<Category> {
    const category = new Category();
    category.title = categoryDto.title;
    return this.categoryEntityRepository.save(category);
  }

  async replaceUserCategoryByOther({ oldCategoryId, newCategoryId, userId }: { oldCategoryId: string, newCategoryId: string, userId: string }): Promise<void> {
    await this.categoryToUserEntityRepository.update({
      userId,
      categoryId: oldCategoryId,
    }, { categoryId: newCategoryId });
  }

  async editCategory({ categoryDto, userId }: { categoryDto: CategoryDto, userId: string }): Promise<CategoryDto> {
    let categoryEntity = await this.getCategoryEntityById(categoryDto.id);
    if (categoryEntity.title !== categoryDto.title) {
      let categoryByTitle = await this.getCategoryEntityByTitle(categoryDto.title);
      if (!categoryByTitle) {
        categoryByTitle = await this.createCategoryEntity(categoryDto);
      }
      await this.replaceUserCategoryByOther({
        oldCategoryId: categoryEntity.id,
        newCategoryId: categoryByTitle.id,
        userId,
      });
      categoryEntity = categoryByTitle;
    }
    const category = await this.getCategoryForUserById({
      categoryId: categoryEntity.id,
      userId,
    });
    if (category.color !== categoryDto.color) {
      await this.changeUserCategoryColor({
        categoryDto: {
          id: categoryEntity.id,
          color: categoryDto.color,
          title: categoryDto.title,
        },
        userId,
      });
    }
    return this.getCategoryForUserById({
      categoryId: categoryEntity.id,
      userId,
    });
  }

  async deleteCategoryFromUser({ categoryId, userId }: { categoryId: string, userId: string }) {
    await this.categoryToUserEntityRepository.delete({
      categoryId,
      userId,
    });
  }
}
