import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { CreateQuizDto } from './dto/create-quiz.dto';

import { RolesGuard } from '../roles/roles.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { Quiz } from './domain/quiz';
import { AddAnswerQuizDto } from './dto/add-answer-quiz.dto';
import { QueryQuizDto } from './dto/query-question.dto';
import { QuizzesService } from './quizzes.service';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user) // Adjust according to your roles
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Quizzes')
@Controller({
  path: 'quizzes',
  version: '1',
})
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createQuizDto: CreateQuizDto, @Req() req): Promise<Quiz> {
    const user = req.user;
    return this.quizzesService.create({ ...createQuizDto, user: user.id });
  }

  @Post('answer')
  @HttpCode(HttpStatus.CREATED)
  answer(
    @Body() addAnswerQuizDto: AddAnswerQuizDto,
    @Req() req,
  ): Promise<Quiz> {
    const user = req.user;
    return this.quizzesService.addAnswer({
      ...addAnswerQuizDto,
      user: {
        id: user.id.toString(),
      },
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryQuizDto,
    @Req() req,
  ): Promise<InfinityPaginationResultType<Quiz>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.quizzesService.findManyWithPagination({
        userId: req.user.id,
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

  @Get('resume')
  @HttpCode(HttpStatus.OK)
  resume(@Req() req): Promise<NullableType<Quiz>> {
    return this.quizzesService.resume(req.user.id);
  }

  @Get('cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@Req() req): Promise<NullableType<Quiz>> {
    return this.quizzesService.cancel(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Param('id') id: Quiz['id'],
    @Req() req,
  ): Promise<NullableType<Quiz>> {
    return this.quizzesService.findOne({ id, user: req.user.id });
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Quiz['id']): Promise<void> {
    return this.quizzesService.softDelete(id);
  }
}
