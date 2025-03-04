import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceException extends Error {
  constructor(name: string, { message, stack }: ServerErrorArguments) {
    super(message);
    this.name = name;
    this.stack = stack;
  }

  static NotFound(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceException.NotFound;
    return new ServiceException(name, descriptors);
  }

  static AuthError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceException.AuthError;
    return new ServiceException(name, descriptors);
  }

  static DeletionError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceException.DeletionError;
    return new ServiceException(name, descriptors);
  }

  static DatabaseError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceException.DatabaseError;
    return new ServiceException(name, descriptors);
  }

  static RedisError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceException.RedisError;
    return new ServiceException(name, descriptors);
  }

  static WorkerError(this: void, descriptors: ServerErrorArguments) {
    const { name } = ServiceException.WorkerError;
    return new ServiceException(name, descriptors);
  }
}

export type ServerErrorArguments = {
  message: string;
  stack?: string;
};
