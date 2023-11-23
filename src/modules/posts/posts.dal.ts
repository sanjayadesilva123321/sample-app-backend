import {Inject, Injectable} from "@nestjs/common";
import {POST_REPOSITORY} from "../../constant";
import {Post} from "../../models/post";
import {User} from "../../models/user";

@Injectable()
export class PostDal {
    constructor(@Inject(POST_REPOSITORY) private readonly postRepository: typeof Post) {}

    /**
     * Find all posts by payload
     * @param conditions
     * @return posts object array
     */
      async findAllByPayload(conditions: any = {}):Promise<Post[]> {
          return this.postRepository.findAll(conditions);
      }

    /**
     * get the posts list for non admin users
     * @param conditions
     * @param roleId
     * @return posts array
     */
      async findAllByPayloadForNonAdminUsers(conditions: any ={}, roleId: number):Promise<Post[]> {
        return this.postRepository.findAll({
            where: conditions,
            include: [
                {
                    model: User,
                    where: {
                        role_id: roleId
                    },
                    attributes: []
                }
            ],
            attributes: ['id', 'title', 'content']
        });
    }

    /**
     * Find post by payload
     * @param payload
     * @returns post object
     */
    async findOne(payload: any):Promise<Post> {
        return await this.postRepository.findOne(payload);
    }

    /**
     * Delete post record by given condition
     * @param condition
     * @returns the count of deleted posts
     */
    async delete(condition: any):Promise<number> {
        return this.postRepository.destroy({where: condition});
    }
}
