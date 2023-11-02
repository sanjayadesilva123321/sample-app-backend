import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "./database/database.module";
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    }),
    DatabaseModule,
    PostsModule, 
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
