import {Inject, Injectable} from "@nestjs/common";
import {POST_REPOSITORY} from "../../constant/index";
import {Post} from "../../models/post";
import {User} from "../../models/user";

@Injectable()
export class PostDal {
    constructor(@Inject(POST_REPOSITORY) private readonly postRepository: typeof Post) {}

    /**
     * Find all user details by payload
     * @param payload
     */

      async findAllByPayload(conditions: any = null):Promise<Post[]> {
        const hasConditions = conditions ? {where: conditions} : {};
          return this.postRepository.findAll(hasConditions);
      }

    async findAllByPayloadForNonAdminUsers(conditions: any =null, roleId: number):Promise<Post[]> {
        const query = {
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
        };
        const hasConditions = conditions
            ? {
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
            }
            : query;
        return this.postRepository.findAll(hasConditions);
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
     * @returns deleted record details
     */
    async delete(condition: any):Promise<number> {
        return this.postRepository.destroy({where: condition});
    }
}
