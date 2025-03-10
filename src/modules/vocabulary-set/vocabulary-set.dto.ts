import { IsString, MinLength, ValidateNested, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { FlashCard } from 'src/shared/db/db.schema';

class CreateFlashCardDto {
  @IsString()
  translation: string;

  @IsString()
  @MinLength(2)
  definition: string;
}

class UpdateFlashCardDto {
  @IsString()
  @MinLength(2)
  id: string;

  @IsString()
  @MinLength(2)
  translation: string;

  @IsString()
  @MinLength(2)
  definition: string;
}

export class CreateVocabularySetDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashCardDto)
  flashCards: CreateFlashCardDto[];

  createdAt: Date = new Date();
}

export class UpdateVocabularySetDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFlashCardDto)
  flashCards: UpdateFlashCardDto[];
}
