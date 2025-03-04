import { eq } from 'drizzle-orm';
import { type User, users } from '../db/schema';
import { ServiceException } from 'src/common/service-exception';
import { Injectable } from '@nestjs/common';
import * as sc from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
class UserRepository {
  constructor(private db: NodePgDatabase<typeof sc>) {}

  public async create(newUser: User): Promise<User> {
    try {
      const [createdUser] = await this.db
        .insert(users)
        .values(newUser)
        .returning();

      return createdUser;
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

  public async getByEmail(email: string): Promise<User> {
    try {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      return user;
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

  public async getById(id: string): Promise<User> {
    try {
      const [user] = await this.db.select().from(users).where(eq(users.id, id));

      return user;
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

export default UserRepository;
