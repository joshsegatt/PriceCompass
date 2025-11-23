import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));
  // Allow CORS with credentials so the Next frontend can include cookies/credentials
  app.enableCors({ origin: true, credentials: true });
  await app.listen(process.env.PORT || 3000);
  console.log('Server listening on', process.env.PORT || 3000);
}

bootstrap();
