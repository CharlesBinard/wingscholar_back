import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { QuestionCategorySchemaClass } from '../../../../../question-categories/infrastructure/persistence/document/entities/question-category.schema';
import { QuestionSchemaClass } from '../../../../../questions/infrastructure/persistence/document/entities/question.schema';
import { QuizAnswerSchemaClass } from '../../../../../quiz-answers/infrastructure/persistence/document/entities/quiz-answer.schema';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { QuizStatusEnum, QuizTypeEnum } from '../../../../domain/quiz';

export type QuizSchemaDocument = HydratedDocument<QuizSchemaClass>;

@Schema({
  collection: 'quizzes',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuizSchemaClass extends EntityDocumentHelper {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchemaClass' })
  user: UserSchemaClass;

  @Prop({ type: String, enum: QuizTypeEnum })
  type: QuizTypeEnum;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionSchemaClass',
      },
    ],
  })
  questions: QuestionSchemaClass[];

  @Prop({
    type: String,
    enum: QuizStatusEnum,
    default: QuizStatusEnum.IN_PROGRESS,
  })
  status: QuizStatusEnum;

  @Prop({ type: Number, required: false })
  score?: number | null;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionCategorySchemaClass',
      },
    ],
  })
  categories: QuestionCategorySchemaClass[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizAnswerSchemaClass',
      },
    ],
    default: [],
    required: false,
  })
  answers?: QuizAnswerSchemaClass[];

  @Prop({ type: Number, default: 0 })
  totalQuestions: number;

  @Prop({ type: Date, required: false })
  completedAt?: Date | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(QuizSchemaClass);
