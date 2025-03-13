// filepath: /c:/Users/korne/Desktop/Fluentify-server/src/modules/vocabulary-set/vocabulary-set.service.ts
import { Injectable } from '@nestjs/common';
import type {
  FindOneByIdResponseDto,
  UpdateVocabularySetDto,
  CreateVocabularySetDto,
  FindAllByUserIdResponseDto,
} from './vocabulary-set.dto';
import type { VocabularySetRepository } from 'src/shared/repositories/vocabulary-set.reposiory';

@Injectable()
export class VocabularySetService {
  constructor(
    private readonly vocabularySetRepository: VocabularySetRepository,
  ) {}

  public async create(
    createVocabularySetDto: CreateVocabularySetDto,
    userId: string,
  ): Promise<string> {
    const vocabularySetId = await this.vocabularySetRepository.create(
      { ...createVocabularySetDto, userId },
      createVocabularySetDto.flashCards.map((flashCard) => ({
        ...flashCard,
        userId,
      })),
    );

    console.log('vocabularySetId', vocabularySetId);

    // if (!vocabularySetId) {
    //   throw ServiceException.NotFound({
    //     message: 'Vocabulary set not created',
    //   });
    // }

    return vocabularySetId;
  }

  public async findAllByUserId(
    userId: string,
    page?: string,
    searchInput?: string,
  ): Promise<FindAllByUserIdResponseDto> {
    const itemsPerPage = 5;

    const vocabularySets = await this.vocabularySetRepository.findAllByUserId(
      userId,
      page,
      searchInput,
    );

    const hasMore = vocabularySets.length > itemsPerPage;

    const paginatedResults = hasMore
      ? vocabularySets.slice(0, itemsPerPage)
      : vocabularySets;

    return { vocabularySets: paginatedResults, hasMore };
  }

  public async findOneById(id: string): Promise<FindOneByIdResponseDto> {
    const vocabularySet = await this.vocabularySetRepository.findOneById(id);

    // if (!vocabularySet) {
    //   throw new NotFoundException('Vocabulary set not found');
    // }

    return vocabularySet;
  }

  public async update(
    id: string,
    vocabularySet: UpdateVocabularySetDto,
  ): Promise<string> {
    const updatedVocabularySetId = await this.vocabularySetRepository.update(
      id,
      vocabularySet,
    );

    // if (!updatedVocabularySetId) {
    //   throw new NotFoundException('Vocabulary set not updated');
    // }

    return updatedVocabularySetId;
  }

  public async delete(id: string): Promise<string> {
    await this.vocabularySetRepository.deleteById(id);
    return id;
  }
}
