import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/shared/db/schema';
import UserRepository from 'src/shared/repositories/user.repository';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: [
        'profile',
        'email',
        'openid',
        'https://www.googleapis.com/auth/cloud-platform',
      ],
    });

    passport.use(this);

    passport.serializeUser(({ id }: User, done) => {
      this.logger.log(`User has been serialized ${id}`);
      done(null, user);
    });

    passport.deserializeUser(
      async (id: string, done: (err: any, user?: User) => void) => {
        const currentUser = await userRepository.getById(id);

        if (!currentUser)
          throw new HttpException(
            "User doesn't exist",
            HttpStatus.UNAUTHORIZED,
          );

        return done(null, currentUser);
      },
    );
  }

  public async validate() {}
}
