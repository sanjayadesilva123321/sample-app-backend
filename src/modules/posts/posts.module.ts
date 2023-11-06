import { Module, Logger } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MainService } from '../../utils/main/main.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, MainService, Logger],
})
export class PostsModule {}
