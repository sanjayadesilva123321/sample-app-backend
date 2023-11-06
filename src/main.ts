import { NestFactory } from '@nestjs/core';
import {ConfigService} from "@nestjs/config";
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const config = new DocumentBuilder()
  .setTitle('Your API')
  .setDescription('API description')
  .setVersion('1.0')
  .addTag('API')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000);
  console.log("Sample app started at port : " + configService.get("PORT"));
}
bootstrap();
