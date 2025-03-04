import { Injectable, Logger } from '@nestjs/common';
import * as Redis from 'redis';
import { ServiceException } from '../../common/service-exception';

@Injectable()
export class RedisService {
  public client: Redis.RedisClientType = Redis.createClient();
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.cacheError();
  }

  public connect(): void {
    this.client
      .connect()
      .then(() => {
        this.logger.log('Redis connection established');
      })
      .catch((error: Error) => {
        throw ServiceException.RedisError({
          message: error.message,
          stack: error.stack,
        });
      });
  }

  //   private async connectionGuard(): Promise<void> {
  //     try {
  //       if (!this.client.isOpen) await this.client.connect();
  //     } catch (error: unknown) {
  //       if (error instanceof Error)
  //         throw ServiceException.RedisError({
  //           message: error.message,
  //           stack: error.stack,
  //         });
  //     }
  //   }
  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.logger.error(error);
    });
  }
}
