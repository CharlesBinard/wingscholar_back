import { FileType } from '../../files/domain/file';

export enum QuestionCategoryExamEnum {
  PPL = 'PPL',
}

export class QuestionCategory {
  id: string | number;

  name: string;

  exam: QuestionCategoryExamEnum;

  color?: string | null;

  picture?: FileType | null;

  questionsCount?: number | null;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
