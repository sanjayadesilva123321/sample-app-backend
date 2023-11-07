import {Inject, Injectable} from "@nestjs/common";
import {POST_REPOSITORY} from "../../constant/index";
import {Post} from "../../models/post";

@Injectable()
export class PostDal{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepository: typeof Post) {}

    /**
     * Find all user details by payload
     * @param payload
     */
    async findAllByPayload(payload: any) {
        try {
            return await this.postRepository.findAll(payload);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Find post by payload
     * @param payload
     * @returns post object
     */
    async findOne(payload: any) {
        try {
            return await this.postRepository.findOne(payload);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Delete post record by given condition
     * @param condition
     * @returns deleted record details
     */
        async delete(condition: any) {
            return this.postRepository.destroy({where: condition});
        }
}