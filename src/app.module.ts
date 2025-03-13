import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import configuration from './common/config/configuration';
import { DbModule } from './shared/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from './shared/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { VocabularySetModule } from './modules/vocabulary-set/vocabulary-set.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
    DbModule,
    AuthModule,
    VocabularySetModule,
    RedisModule,
  ],
  providers: [AppService],
})
export class AppModule {}
