// filepath: /c:/Users/korne/Desktop/Fluentify-server/src/modules/vocabulary-set/vocabulary-set.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { VocabularySetService } from './vocabulary-set.service';
import type {
  CreateVocabularySetDto,
  FindAllByUserIdResponseDto,
  FindOneByIdResponseDto,
  UpdateVocabularySetDto,
} from './vocabulary-set.dto';
import { GoogleAuthGuard } from '../auth/strategies/google.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('vocabulary-set')
@UseGuards(GoogleAuthGuard)
export class VocabularySetController {
  public readonly logger: Logger = new Logger(VocabularySetController.name);

  constructor(public vocabularySetService: VocabularySetService) {}

  @Post()
  public async create(
    @Body() createVocabularySetDto: CreateVocabularySetDto,
    @UserId() userId: string,
  ): Promise<{ id: string }> {
    const id = await this.vocabularySetService.create(
      createVocabularySetDto,
      userId,
    );

    this.logger.log(
      `Created vocabulary set with ID: ${id} for user: ${userId}`,
    );

    return { id };
  }

  @Get(':page')
  public async findAllByUserId(
    @UserId() userId: string,
    @Param('page') page?: string,
    @Param('searchInput') searchInput?: string,
  ): Promise<FindAllByUserIdResponseDto> {
    console.log('page', page);
    console.log('searchInput', searchInput);

    const result = await this.vocabularySetService.findAllByUserId(
      userId,
      page,
      searchInput,
    );

    this.logger.log(`Found vocabulary sets for user ID: ${userId}`);

    return result;
  }

  @Get(':id')
  public async findOneById(
    @Param('id') id: string,
  ): Promise<FindOneByIdResponseDto> {
    const result = await this.vocabularySetService.findOneById(id);

    this.logger.log(`Found vocabulary set with ID: ${id}`);

    return result;
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateVocabularySetDto: UpdateVocabularySetDto,
  ) {
    const result = await this.vocabularySetService.update(
      id,
      updateVocabularySetDto,
    );

    this.logger.log(`Updated vocabulary set with ID: ${id}`);

    return result;
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    const deletedVocabularySetId = await this.vocabularySetService.delete(id);

    this.logger.log(
      `Deleted vocabulary set with ID: ${deletedVocabularySetId}`,
    );

    return deletedVocabularySetId;
  }
}
