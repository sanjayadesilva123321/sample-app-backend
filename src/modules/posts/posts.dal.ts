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
     * Find user by payload
     * @param payload
     * @returns user object
     */
    async findOne(payload: any) {
        try {
            return await this.postRepository.findOne(payload);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}