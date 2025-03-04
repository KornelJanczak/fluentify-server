import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import { User } from 'src/shared/db/schema';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Get('/logout')
  public logOut(@Req() req: Request) {
    req.logout((error) => {
      if (error) {
        throw new HttpException(
          'User is not authorized to this action',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        this.logger.log(`User has been logged out`);

        return 'Logged out successfully';
      }
    });
  }

  @Get('/session')
  public authSession(@Req() req: Request) {
    const currentUser: User = req.user as User;

    if (!currentUser)
      throw new HttpException(
        'User is not authorized to this action',
        HttpStatus.UNAUTHORIZED,
      );

    this.logger.log(`User is authenticated ${currentUser.id}`);

    return currentUser;
  }
}
