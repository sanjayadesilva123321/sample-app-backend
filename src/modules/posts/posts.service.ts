import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDal } from "./posts.dal";
import { POST_REPOSITORY } from "../../constant/index";
import { Post } from "../../models/post";

@Injectable()
export class PostsService {
  constructor(
    private postDal: PostDal,
    private readonly logger: Logger,
    @Inject(POST_REPOSITORY) private postRepository: typeof Post,
) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async getPosts(roleId) {
    try {
      return await this.postDal.findAllByPayload({
        'created_by':10006
    });
    } catch (error) {
      this.logger.error("Error occured :getPosts in post service: "+ error)
      throw error;
    }
}
}
