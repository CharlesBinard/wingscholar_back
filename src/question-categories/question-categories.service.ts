import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import {
  QuestionCategory,
  QuestionCategoryExamEnum,
} from './domain/question-category';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';
import {
  FilterQuestionCategoryDto,
  SortQuestionCategoryDto,
} from './dto/query-question-category.dto';
import { QuestionCategoryRepository } from './infrastructure/persistence/question-category.repository';

@Injectable()
export class QuestionCategoriesService {
  constructor(
    private readonly questionCategoriesRepository: QuestionCategoryRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createProfileDto: CreateQuestionCategoryDto,
  ): Promise<QuestionCategory> {
    const clonedPayload = {
      ...createProfileDto,
    };

    if (clonedPayload.picture?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.picture.id,
      });
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      clonedPayload.picture = fileObject;
    }

    if (clonedPayload.exam) {
      const roleObject = Object.values(QuestionCategoryExamEnum).includes(
        clonedPayload.exam,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }
    }

    return this.questionCategoriesRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuestionCategoryDto | null;
    sortOptions?: SortQuestionCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<QuestionCategory[]> {
    return this.questionCategoriesRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(
    fields: EntityCondition<QuestionCategory>,
  ): Promise<NullableType<QuestionCategory>> {
    return this.questionCategoriesRepository.findOne(fields);
  }

  find(fields: EntityCondition<QuestionCategory>): Promise<QuestionCategory[]> {
    return this.questionCategoriesRepository.find(fields);
  }

  async update(
    id: QuestionCategory['id'],
    payload: DeepPartial<QuestionCategory>,
  ): Promise<QuestionCategory | null> {
    const clonedPayload = { ...payload };

    if (clonedPayload.picture?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.picture.id,
      });
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      clonedPayload.picture = fileObject;
    }

    if (clonedPayload.exam) {
      const roleObject = Object.values(QuestionCategoryExamEnum).includes(
        clonedPayload.exam,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'examNotExists',
          },
        });
      }
    }

    return this.questionCategoriesRepository.update(id, clonedPayload);
  }

  async softDelete(id: QuestionCategory['id']): Promise<void> {
    await this.questionCategoriesRepository.softDelete(id);
  }
}
