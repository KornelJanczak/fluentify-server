import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConsoleLogger } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';

const logger = new Logger('Bootstrap');

class Application {
  public async bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: new ConsoleLogger({
        logLevels: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
        timestamp: true,
        prefix: 'fluentify',
      }),
    });

    const appService = app.get<AppService>(AppService);
    appService.configure(app);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(process.env.PORT ?? 5000);
    Application.handleExit();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      logger.error({
        message: `There was an uncaught error: ${error.message}`,
        stack: error.stack,
      });
      Application.shutDownProperly(1);
    });

    process.on('unhandledRejection', (reason: any) => {
      logger.error({
        message: `Unhandled rejection at promise: ${reason}`,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
      Application.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      logger.error('Caught SIGTERM');
      Application.shutDownProperly(2);
    });

    process.on('SIGINT', () => {
      logger.error({
        service: 'SIGINT',
        message: 'Caught SIGINT',
      });
      Application.shutDownProperly(2);
    });

    process.on('exit', () => {
      logger.error({
        service: 'exit',
        message: 'Exiting',
      });
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        logger.log('Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        logger.error({
          message: `Error during shutdown: ${error}`,
          stack: error instanceof Error ? error.stack : undefined,
        });
        process.exit(1);
      });
  }
}

void (async (): Promise<void> => {
  try {
    const application = new Application();
    const url = await application.bootstrap();
    logger.log(url, 'Bootstrap');
  } catch (error) {
    logger.error(error, 'Bootstrap');
  }
})();
