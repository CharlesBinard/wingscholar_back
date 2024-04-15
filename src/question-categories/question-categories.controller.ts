import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { QuestionCategory } from './domain/question-category';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';
import { QueryQuestionCategoryDto } from './dto/query-question-category.dto';
import { UpdateQuestionCategoryDto } from './dto/update-question-category.dto';
import { QuestionCategoriesService } from './question-categories.service';

@ApiBearerAuth()
@ApiTags('QuestionCategories')
@Controller({
  path: 'question-categories',
  version: '1',
})
export class QuestionCategoriesController {
  constructor(
    private readonly questionCategoriesService: QuestionCategoriesService,
  ) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createProfileDto: CreateQuestionCategoryDto,
  ): Promise<QuestionCategory> {
    return this.questionCategoriesService.create(createProfileDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryQuestionCategoryDto,
  ): Promise<InfinityPaginationResultType<QuestionCategory>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.questionCategoriesService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Param('id') id: QuestionCategory['id'],
  ): Promise<NullableType<QuestionCategory>> {
    return this.questionCategoriesService.findOne({ id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: QuestionCategory['id'],
    @Body() updateProfileDto: UpdateQuestionCategoryDto,
  ): Promise<QuestionCategory | null> {
    return this.questionCategoriesService.update(id, updateProfileDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: QuestionCategory['id']): Promise<void> {
    return this.questionCategoriesService.softDelete(id);
  }
}
