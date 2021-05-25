import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { format } from 'date-fns-tz';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = function (): any {
    return format(this, 'YYYY-MM-DD HH:mm:ss.SSS', {
      timeZone: 'America/Sao_Paulo',
    });
  };
  await app.listen(8080);
}
bootstrap();
