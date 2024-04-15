import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument, now } from 'mongoose';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { QuestionCategoryExamEnum } from '../../../../domain/question-category';

export type QuestionCategorySchemaDocument =
  HydratedDocument<QuestionCategorySchemaClass>;

@Schema({
  collection: 'question_categories',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuestionCategorySchemaClass extends EntityDocumentHelper {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, enum: QuestionCategoryExamEnum })
  exam: QuestionCategoryExamEnum;

  @Prop({ type: String, required: false })
  color?: string | null;

  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  picture?: FileSchemaClass | null;

  @Prop({ type: Number, default: 0 })
  questionsCount?: number | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const QuestionCategorySchema = SchemaFactory.createForClass(
  QuestionCategorySchemaClass,
);
