import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { QuestionCategorySchemaClass } from '../../../../../question-categories/infrastructure/persistence/document/entities/question-category.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { QuestionAnswerEnum } from '../../../../domain/question';

export enum QuestionsLanguageEnum {
  ENGLISH = 'EN',
  FRENCH = 'FR',
}

export type QuestionSchemaDocument = HydratedDocument<QuestionSchemaClass>;

@Schema({
  collection: 'questions',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuestionSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({ type: String, required: false })
  explanation?: string | null;

  @Prop({ type: String, required: false })
  annex?: string | null;

  @Prop({ type: String })
  answer_1: string;

  @Prop({ type: String })
  answer_2: string;

  @Prop({ type: String })
  answer_3: string;

  @Prop({ type: String })
  answer_4: string;

  @Prop({ type: String, enum: QuestionAnswerEnum })
  correct_answer?: QuestionAnswerEnum;

  @Prop({ type: String, required: false })
  answer_annex?: string | null;

  @Prop({ type: String, enum: QuestionsLanguageEnum })
  language: QuestionsLanguageEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionCategorySchemaClass',
  })
  category: QuestionCategorySchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionSchemaClass);
