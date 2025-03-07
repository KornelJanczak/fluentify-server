import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  public async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    console.log('activate', activate);
    const request = context.switchToHttp().getRequest<Request>();
    console.log('request', request);
    await super.logIn(request);
    return activate;
  }
}
