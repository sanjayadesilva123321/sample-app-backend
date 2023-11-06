import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDal } from "./posts.dal";

@Injectable()
export class PostsService {
  constructor(
    private userDal: PostDal,
    private readonly logger: Logger
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
    } catch (error) {
      this.logger.error("Error occured :validateUserPassword in user service: "+ error)
      throw error;
    }
}
}
