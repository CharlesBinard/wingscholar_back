import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { QuestionAnswerEnum } from '../../../../../questions/domain/question';
import { QuestionSchemaClass } from '../../../../../questions/infrastructure/persistence/document/entities/question.schema';
import { QuizSchemaClass } from '../../../../../quizzes/infrastructure/persistence/document/entities/quiz.schema';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type QuizAnswerSchemaDocument = HydratedDocument<QuizAnswerSchemaClass>;

@Schema({
  collection: 'quiz_answers',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuizAnswerSchemaClass extends EntityDocumentHelper {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QuizSchemaClass' })
  quiz: QuizSchemaClass;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionSchemaClass' })
  question: QuestionSchemaClass;

  @Prop({ type: String, enum: QuestionAnswerEnum })
  selectedAnswer: QuestionAnswerEnum;

  @Prop({ type: Boolean, required: false, default: null })
  isCorrect?: boolean | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchemaClass' })
  user: UserSchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const QuizAnswerSchema = SchemaFactory.createForClass(
  QuizAnswerSchemaClass,
);
