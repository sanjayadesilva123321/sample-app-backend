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

  async updatePost(id: number, title, content) {
    try {
      const post = await this.postDal.findOne(id);

      if (!post) {
        throw new Error('Post not found');
      }
      const [rowsUpdated, [updatedPost]] = await Post.update({'title': title, 'content': content}, {
        where: { id: id },
        returning: true,
      });
  
      if (rowsUpdated !== 1 || !updatedPost) {
        throw new Error('Post not found or not updated');
      }    
      return updatedPost;
    
    } catch (error) {
      this.logger.error("Error occured :updatePosts in post service: "+ error)
      throw error;
    }

  }

  async removePost(id: number) {
    try {
      const postData: any = await this.postDal.findOne({
        where: {
          id: id,
      }
      });
      //console.log(postData.title);
      if (!postData) {
          this.logger.error(
              "Error in post service : post not found"
          );
          throw Error("Cannot find the post");
      }

      await this.postDal.delete({id:id})

    } catch (error: any) {
        this.logger.error("Error in post service : " + error);
        throw Error(error);
    }
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
