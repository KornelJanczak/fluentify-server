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
  Req,
} from '@nestjs/common';
import { VocabularySetService } from './vocabulary-set.service';
import {
  CreateVocabularySetDto,
  UpdateVocabularySetDto,
} from './vocabulary-set.dto';
import { GoogleAuthGuard } from '../auth/strategies/google.guard';
import { Request } from 'express';
import { User } from 'src/shared/db/db.schema';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('vocabulary-set')
@UseGuards(GoogleAuthGuard)
export class VocabularySetController {
  public readonly logger: Logger = new Logger(VocabularySetController.name);

  constructor(public vocabularySetService: VocabularySetService) {}

  @Post()
  public async create() {
    console.log('asdasd');

    // console.log('createVocabularySetDto', createVocabularySetDto);
    // console.log('userId', userId);

    // const result = await this.vocabularySetService.create(
    //   createVocabularySetDto,
    //   userId,
    // );

    this.logger.log(`Created vocabulary set with ID: `);

    return 'result';
  }

  //   @Get('user/:userId')
  //   public async findAll(
  //     @Param('page') page: string,
  //     @Param('searchInput') searchInput?: string,
  //   ) {
  //     const result = await this.vocabularySetService.findAllByUserId(userId);
  //     this.logger.log(`Found vocabulary sets for user ID: ${userId}`);
  //     return result;
  //   }

  //   @Get(':id')
  //   public async findOne(@Param('id') id: string) {
  //     const result =
  //       await this.vocabularySetService.findOneWithFlashCardsById(id);
  //     this.logger.log(`Found vocabulary set with ID: ${id}`);
  //     return result;
  //   }

  //   @Put(':id')
  //   public async update(
  //     @Param('id') id: string,
  //     @Body() updateVocabularySetDto: UpdateVocabularySetDto,
  //   ) {
  //     const result = await this.vocabularySetService.update(
  //       id,
  //       updateVocabularySetDto,
  //     );
  //     this.logger.log(`Updated vocabulary set with ID: ${id}`);
  //     return result;
  //   }

  //   @Delete(':id')
  //   public async delete(@Param('id') id: string) {
  //     const result = await this.vocabularySetService.delete(id);
  //     this.logger.log(`Deleted vocabulary set with ID: ${id}`);
  //     return result;
  //   }
}
