import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceError extends Error {
  constructor(name: string, { message, stack }: ServerErrorArguments) {
    super(message);
    this.name = name;
    this.stack = stack;
  }

  static NotFound(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceError.NotFound;
    return new ServiceError(name, descriptors);
  }

  static AuthError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceError.AuthError;
    return new ServiceError(name, descriptors);
  }

  static DeletionError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceError.DeletionError;
    return new ServiceError(name, descriptors);
  }

  static DatabaseError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceError.DatabaseError;
    return new ServiceError(name, descriptors);
  }

  static RedisError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceError.RedisError;
    return new ServiceError(name, descriptors);
  }

  static WorkerError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceError.WorkerError;
    return new ServiceError(name, descriptors);
  }
}

export type ServerErrorArguments = {
  message: string;
  stack?: string;
};
