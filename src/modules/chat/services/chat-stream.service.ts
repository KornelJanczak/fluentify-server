import { Injectable } from '@nestjs/common';
import { streamText, CoreMessage, pipeDataStreamToResponse } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { customAi } from '@shared/services/ai';
import type { Chat, User } from 'src/shared/db/db.schema';
import { ServiceError } from 'src/common/service-error';
import { ChatRepository } from 'src/shared/repositories/chat.repository';
import { SystemPromptService } from './system-prompt.service';
import { AudioGeneratorService } from './audio-generator.service';
import { StartChatDto } from '../chat.dto';

@Injectable()
export class ChatStreamService {
  constructor(
    private audioGeneratorService: AudioGeneratorService,
    private systemPromptService: SystemPromptService,
    private chatRepository: ChatRepository,
    // private audioUploaderService: IAudioUploaderService,
  ) {}

  public async startChatStream(
    startChatDto: StartChatDto,
    user: User,
    res: Response,
  ): Promise<void> {
    const chat = await this.getChat(startChatDto.chatId);
    const lastUserMessage = this.extractLastUserMessage(startChatDto.messages);
    await this.saveMessage(chat.id, lastUserMessage, null);

    // Get system prompt to start the conversation
    const systemPrompt = await this.systemPromptService.getSystemPrompt({
      tutorId: startChatDto.tutorId,
      chatCategory: chat.category,
      chatTopic: chat.topic,
      studyingLanguageLevel: startChatDto.studyingLanguageLevel,
      vocabularySetId: startChatDto.vocabularySetId,
    });

    // Start chat with AI
    return await this.streamChatToResponse(startChatDto, systemPrompt);
  }

  private async getChat(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.findById(chatId);

    if (!chat) throw ServiceError.NotFoundError(`Chat ${chatId} not found`);

    return chat;
  }

  private extractLastUserMessage(messages: CoreMessage[]): CoreMessage {
    return messages
      .filter((message: CoreMessage) => message.role === 'user')
      .at(-1);
  }

  private async streamChatToResponse(
    chatRequest: IChatRequest,
    systemPrompt: string,
  ): Promise<void> {
    const { res, chatId, messages, tutorId } = chatRequest;

    return pipeDataStreamToResponse(res, {
      execute: async (streamWriter) => {
        const result = streamText({
          model: customAi('gpt-3.5-turbo'),
          system: systemPrompt,
          messages,
          onFinish: async ({ text, usage }) => {
            await this.onFinishStream({
              chatId,
              content: text,
              streamWriter,
              tutorId,
              usedTokens: usage.totalTokens,
            });
          },
        });

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream({
    chatId,
    content,
    streamWriter,
    tutorId,
    usedTokens,
  }: IOnFinishStream): Promise<void> {
    const { audioContent } = await this.audioGeneratorService.generateAudio(
      content,
      tutorId,
    );

    streamWriter.writeMessageAnnotation({
      type: 'audio',
      data: JSON.stringify(audioContent),
    });

    const messageId = await this.saveMessage(
      chatId,
      { content, role: 'assistant' },
      usedTokens,
    );

    // await this.audioUploaderService.uploadAudio(audioContent, messageId);
  }

  private async saveMessage(
    chatId: string,
    message: CoreMessage,
    usedTokens?: number,
  ): Promise<string> {
    return await this.chatRepository.saveMessages([
      {
        id: uuidv4(),
        ...message,
        createdAt: new Date(),
        chatId,
        usedTokens,
      },
    ]);
  }
}
