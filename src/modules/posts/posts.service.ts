import {Inject, Injectable, Logger} from "@nestjs/common";
import {CreatePostDto} from "./dto/create-post.dto";
import {PostDal} from "./posts.dal";
import {POST_REPOSITORY} from "../../constant/index";
import {Post} from "../../models/post";
import {UserRole} from "../../models/user-role";
import { Sequelize } from "sequelize";

@Injectable()
export class PostsService {
    constructor(
        private postDal: PostDal,
        private readonly logger: Logger,
        @Inject(POST_REPOSITORY) private postRepository: typeof Post
    ) {}

    create(createPostDto: CreatePostDto) {
        return "This action adds a new post";
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
                throw new Error("Post not found");
            }
            const [rowsUpdated, [updatedPost]] = await Post.update(
                {title: title, content: content},
                {
                    where: {id: id},
                    returning: true,
                }
            );

            if (rowsUpdated !== 1 || !updatedPost) {
                throw new Error("Post not found or not updated");
            }
            return updatedPost;
        } catch (error) {
            this.logger.error("Error occured :updatePosts in post service: " + error);
            throw error;
        }
    }

    async removePost(id: number) {
        try {
            const postData: any = await this.postDal.findOne({
                where: {
                    id: id,
                },
            });
            if (!postData) {
                this.logger.error("Error in post service : post not found");
                throw Error("Cannot find the post");
            }

            await this.postDal.delete({id: id});
        } catch (error: any) {
            this.logger.error("Error in post service : " + error);
            throw Error(error);
        }
    }

    async getPosts(roleId: number) {
        try {
            Post.belongsTo(UserRole, {
    foreignKey: 'created_by', // Indicates the foreign key in the Post model
    targetKey: 'user_id', // Indicates the target key in the UserRole model
    as: 'userRoleAssociation' // Alias for the association, you can use this in the include
  });
  
           return await this.postDal.findAllByPayload({
                include: [
                  {
                    model: UserRole,
                    as: 'userRoleAssociation',
                    where: {
                      //user_id: Sequelize.col('post.created_by'),
                      role_id: roleId
                    },
                    attributes: ['user_id'] // To exclude UserRole fields from result except 'user_id'
                  }
                ],
                where: {},
                attributes: ['id', 'title', 'content'] // Add fields you want to retrieve from the Post model
              })
        } catch (error) {
            this.logger.error("Error occured :getPosts in post service: " + error);
            throw error;
        }
    }
}
