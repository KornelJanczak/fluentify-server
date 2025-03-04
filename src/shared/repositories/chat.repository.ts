import { type Chat, type Message, chats, messages } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ServiceException } from 'src/common/service-exception';
import { Injectable } from '@nestjs/common';
import * as sc from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class ChatRepository {
  constructor(private db: NodePgDatabase<typeof sc>) {}

  public async create(newItem: Chat): Promise<string> {
    try {
      const [chat] = await this.db
        .insert(chats)
        .values(newItem)
        .returning({ id: chats.id });

      return chat.id;
    } catch (error) {
      if (error instanceof Error) {
        throw ServiceException.DatabaseError({
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  public async getByUserId(userId: string): Promise<Chat[]> {
    try {
      return await this.db.select().from(chats).where(eq(chats.userId, userId));
    } catch (error) {
      if (error instanceof Error) {
        throw ServiceException.DatabaseError({
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  public async getById(id: string): Promise<Chat> {
    try {
      const [item] = await this.db.select().from(chats).where(eq(chats.id, id));
      return item;
    } catch (error) {
      if (error instanceof Error) {
        throw ServiceException.DatabaseError({
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  public async getWithMessagesById(chatId: string): Promise<ChatWithMessages> {
    try {
      return await this.db.query.chats.findFirst({
        where: eq(chats.id, chatId),
        with: {
          messages: {
            columns: {
              id: true,
              usedTokens: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw ServiceException.DatabaseError({
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  public async deleteById(chatId: string): Promise<string> {
    try {
      const [chat] = await this.db
        .delete(chats)
        .where(eq(chats.id, chatId))
        .returning({ id: chats.id });

      return chat.id;
    } catch (error) {
      if (error instanceof Error) {
        throw ServiceException.DatabaseError({
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  public async saveChatMessages(newMessages: Message[]): Promise<string> {
    try {
      const [{ id }] = await this.db
        .insert(messages)
        .values(newMessages)
        .returning({ id: messages.id });
      return id;
    } catch (error) {
      if (error instanceof Error) {
        throw ServiceException.DatabaseError({
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }
}

export type ChatWithMessages = Chat & {
  messages: Omit<Message, 'chatId'>[];
};
