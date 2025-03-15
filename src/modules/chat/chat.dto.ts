import {
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { CoreMessage } from 'ai';

class BaseChatDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsOptional()
  usedTokens?: number;

  @IsString()
  startedAt: Date;

  @IsString()
  category: string;

  @IsString()
  topic: string;

  @IsString()
  userId: string;

  @IsUUID()
  @IsOptional()
  vocabularySetId?: string;
}

class BaseMessageDto {
  @IsUUID()
  id: string;

  @IsString()
  content: unknown;

  @IsString()
  role: string;

  @IsNumber()
  @IsOptional()
  usedTokens?: number;

  @IsString()
  createdAt: Date;
}

export class StartChatDto {
  @IsString()
  chatId: string;

  @IsString()
  tutorId: string;

  @IsString()
  userId: string;

  @IsString()
  studyingLanguageLevel: string;

  @IsOptional()
  @IsUUID()
  vocabularySetId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseMessageDto)
  messages: BaseMessageDto[];
}

export class CreateChatDto extends OmitType(BaseChatDto, [
  'id',
  'startedAt',
  'userId',
] as const) {}

export class FindWithMessagesByIdResponseDto extends BaseChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseMessageDto)
  messages: BaseMessageDto[];
}

export class FindAllByUserIdResponseDto extends BaseChatDto {}

export class FindOneByIdResponseDto extends BaseChatDto {}
