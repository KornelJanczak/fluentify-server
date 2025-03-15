import { Injectable } from '@nestjs/common';
import { PromptFactory } from './promptFactory';
import { VocabPracticePrompt } from './vocabPracticePrompt';
import { ServiceError } from 'src/common/service-error';
import { VocabularySetRepository } from 'src/shared/repositories/vocabulary-set.repository';

@Injectable()
export class SystemPromptService {
  constructor(
    private readonly vocabularySetRepository: VocabularySetRepository,
    private readonly tutorPromptService: ITutorPromptService,
  ) {}

  public async getSystemPrompt({
    tutorId,
    studyingLanguageLevel,
    chatCategory,
    chatTopic,
    vocabularySetId,
  }: IGetSystemPromptArgs): Promise<string> {
    const tutorPrompt = this.tutorPromptService.getTutorPrompt(
      tutorId,
      studyingLanguageLevel,
    );

    const topicPrompt = await this.generateTopicPrompt(
      chatCategory,
      chatTopic,
      vocabularySetId,
    );

    return `${tutorPrompt} ${topicPrompt}`;
  }

  private async generateTopicPrompt(
    chatCategory: string,
    chatTopic: string,
    vocabularySetId?: string,
  ): Promise<string> {
    const topicPrompt: PromptBase = PromptFactory.createPrompt(
      chatCategory,
      chatTopic,
    );

    if (topicPrompt instanceof VocabPracticePrompt && vocabularySetId) {
      const vocabulary =
        await this.getFlashCardsByVocabularySetId(vocabularySetId);

      topicPrompt.useVocabulary(vocabulary);
    }

    return topicPrompt.getPrompt();
  }

  private async getFlashCardsByVocabularySetId(vocabularySetId: string) {
    const flashCards =
      await this.vocabularySetRepository.getFlashCardsByVocabularySetId(
        vocabularySetId,
      );

    if (!flashCards) throw ServiceError.NotFoundError('Flash cards not found');

    return flashCards;
  }
}
