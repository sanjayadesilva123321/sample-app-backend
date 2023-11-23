import {Injectable, Logger} from "@nestjs/common";
import {PostDal} from "./posts.dal";
import {Post} from "../../models/post";
import {ROLE} from '../../constant'

@Injectable()
export class PostsService {
    constructor(
        private postDal: PostDal,
        private readonly logger: Logger
    ) {}

    /**
     * Update post by post ID
     * @param id
     * @param title
     * @param content
     * @return updated Post object
     */
    async updatePost(id: number, title: string, content: string):Promise<Post> {
        try {
            const post: Post = await this.postDal.findOne(id);
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
            this.logger.error("Error occurred :updatePosts in post service: " + error);
            throw error;
        }
    }

    /**
     * Remove post by Post Id
     * @param id
     * @return Promise<void>
     */
    async removePost(id: number) :Promise<void> {
        try {
            const postData: any = await this.postDal.findOne({
                where: {
                    id: id,
                },
            });
            if (!postData) {
                this.logger.error("Error in post service : post not found");
                throw Error("Cannot find the post");
            }else{
                await this.postDal.delete({'id':id})
            }
        } catch (error: any) {
            this.logger.error("Error in post service : " + error);
            throw Error(error);
        }
    }

    /**
     * get posts
     * @param role
     * return Post[]
     */
    async getPosts(role : string): Promise<Post[]> {
        try {
            if(role === ROLE.Admin){
                return await this.postDal.findAllByPayload();
            }if(role=== ROLE.Manager){
                return await this.postDal.findAllByPayloadForNonAdminUsers({},2 )
            }else{
                return [];
            }
        } catch (error) {
            this.logger.error("Error occurred :getPosts in post service: " + error);
            throw error;
        }
    }
}
