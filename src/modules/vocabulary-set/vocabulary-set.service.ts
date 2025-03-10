// filepath: /c:/Users/korne/Desktop/Fluentify-server/src/modules/vocabulary-set/vocabulary-set.service.ts
import { Injectable } from '@nestjs/common';
import { CreateVocabularySetDto } from './vocabulary-set.dto';
import VocabularySetRepository from 'src/shared/repositories/vocabulary-set.reposiory';

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

    // if (!vocabularySetId) {
    //   throw ServiceException.NotFound({
    //     message: 'Vocabulary set not created',
    //   });
    // }

    return vocabularySetId;
  }

  // public async findAllByUserId(
  //   userId: string,
  //   page?: string,
  //   searchInput?: string,
  // ): Promise<IGetAllVocabularySetsArgs> {
  //   const itemsPerPage = 5;

  //   const vocabularySets = await this.vocabularySetRepository.getAllByUserId(
  //     userId,
  //     page,
  //     searchInput,
  //   );

  //   if (!vocabularySets) {
  //     throw new NotFoundException('Vocabulary sets not found');
  //   }

  //   const hasMore = vocabularySets.length > itemsPerPage;

  //   const paginatedResults = hasMore
  //     ? vocabularySets.slice(0, itemsPerPage)
  //     : vocabularySets;

  //   return { vocabularySets: paginatedResults, hasMore };
  // }

  // public async findOneWithFlashCardsById(
  //   id: string,
  // ): Promise<VocabularySetWithFlashCards> {
  //   const vocabularySet =
  //     await this.vocabularySetRepository.getWithFlashCardsById(id);

  //   if (!vocabularySet) {
  //     throw new NotFoundException('Vocabulary set not found');
  //   }

  //   return vocabularySet;
  // }

  // public async update(
  //   id: string,
  //   vocabularySet: VocabularySetWithFlashCards,
  // ): Promise<string> {
  //   const updatedVocabularySetId = await this.vocabularySetRepository.update(
  //     id,
  //     vocabularySet,
  //   );

  //   if (!updatedVocabularySetId) {
  //     throw new NotFoundException('Vocabulary set not updated');
  //   }

  //   return updatedVocabularySetId;
  // }

  // public async delete(id: string): Promise<string> {
  //   await this.vocabularySetRepository.deleteVocabularySetById(id);
  //   return id;
  // }

  // private formatVocabularySetWithFlashCards({
  //   userId,
  //   title,
  //   description,
  //   flashCards,
  // }: ICreateVocabularySetArgs): {
  //   vocabularySet: VocabularySetWithoutId;
  //   flashCards: FlashCardWithoutIds[];
  // } {
  //   const formattedVocabularySet: Omit<VocabularySet, 'id'> = {
  //     userId,
  //     createdAt: new Date(),
  //     title,
  //     description,
  //   };

  //   const formattedFlashCards = flashCards.map((flashCard: FlashCard) => ({
  //     createAt: new Date(),
  //     translation: flashCard.translation,
  //     definition: flashCard.definition,
  //     userId,
  //   }));

  //   return {
  //     vocabularySet: formattedVocabularySet,
  //     flashCards: formattedFlashCards,
  //   };
  // }
}
