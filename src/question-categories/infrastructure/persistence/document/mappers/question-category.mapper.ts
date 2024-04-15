import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';
import { QuestionCategory } from '../../../../domain/question-category';
import { QuestionCategorySchemaClass } from '../entities/question-category.schema';

export class QuestionCategoryMapper {
  static toDomain(raw: QuestionCategorySchemaClass): QuestionCategory {
    const questionCategory = new QuestionCategory();
    questionCategory.id = raw._id.toString();
    questionCategory.name = raw.name;
    questionCategory.exam = raw.exam;
    questionCategory.color = raw.color;
    questionCategory.questionsCount = raw.questionsCount;

    if (raw.picture) {
      questionCategory.picture = FileMapper.toDomain(raw.picture);
    } else if (raw.picture === null) {
      questionCategory.picture = null;
    }

    questionCategory.createdAt = raw.createdAt;
    questionCategory.updatedAt = raw.updatedAt;
    questionCategory.deletedAt = raw.deletedAt;
    return questionCategory;
  }

  static toPersistence(
    questionCategory: QuestionCategory,
  ): QuestionCategorySchemaClass {
    let picture: FileSchemaClass | undefined = undefined;

    if (questionCategory.picture) {
      picture = new FileSchemaClass();
      picture._id = questionCategory.picture.id;
      picture.path = questionCategory.picture.path;
    }

    const questionCategoryEntity = new QuestionCategorySchemaClass();
    if (questionCategory.id && typeof questionCategory.id === 'string') {
      questionCategoryEntity._id = questionCategory.id;
    }
    questionCategoryEntity.name = questionCategory.name;
    questionCategoryEntity.exam = questionCategory.exam;
    questionCategoryEntity.color = questionCategory.color;
    questionCategoryEntity.questionsCount = questionCategory.questionsCount;

    questionCategoryEntity.picture = picture;
    questionCategoryEntity.createdAt = questionCategory.createdAt;
    questionCategoryEntity.updatedAt = questionCategory.updatedAt;
    questionCategoryEntity.deletedAt = questionCategory.deletedAt;
    return questionCategoryEntity;
  }
}
