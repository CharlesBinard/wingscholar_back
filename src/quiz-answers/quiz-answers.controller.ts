import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';

import { RolesGuard } from '../roles/roles.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';

import { UsersService } from '../users/users.service';
import { QuizAnswer } from './domain/quiz-answer';
import { QueryQuizAnswerDto } from './dto/query-quiz-answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz-answer.dto';
import { QuizAnswersService } from './quiz-answers.service';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('QuizAnswers')
@Controller({
  path: 'quiz-answers',
  version: '1',
})
export class QuizAnswersController {
  constructor(
    private readonly quizAnswersService: QuizAnswersService,
    private readonly usersService: UsersService,
  ) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryQuizAnswerDto,
  ): Promise<InfinityPaginationResultType<QuizAnswer>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.quizAnswersService.findManyWithPagination({
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

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Param('id') id: QuizAnswer['id'],
  ): Promise<NullableType<QuizAnswer>> {
    return this.quizAnswersService.findOne({ id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: QuizAnswer['id'],
    @Body() updateProfileDto: UpdateQuizAnswerDto,
  ): Promise<QuizAnswer | null> {
    return this.quizAnswersService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: QuizAnswer['id']): Promise<void> {
    return this.quizAnswersService.softDelete(id);
  }
}
