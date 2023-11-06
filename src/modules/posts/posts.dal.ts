import {Inject, Injectable} from "@nestjs/common";
import {USER_REPOSITORY} from "../../constant/index";
import {User} from "../../models/user";

@Injectable()
export class PostDal{
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) {}

    /**
     * Find all user details by payload
     * @param payload
     */
    async findAllByPayload(payload: any) {
        try {
            return await this.userRepository.findAll(payload);
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
            return await this.userRepository.findOne(payload);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createUser(payload: any) {
        return this.userRepository.create(payload);
    }
}