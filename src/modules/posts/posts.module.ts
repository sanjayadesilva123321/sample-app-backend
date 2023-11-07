import { Module, Logger } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MainService } from '../../utils/main/main.service';
import { PostDal } from "./posts.dal";
import { PostProvider } from "./posts.provider";

@Module({
  controllers: [PostsController],
  providers: [...PostProvider, PostsService, MainService, Logger, PostDal
],
})
export class PostsModule {}
