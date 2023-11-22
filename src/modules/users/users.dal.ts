import {Inject, Injectable} from "@nestjs/common";
import {USER_REPOSITORY} from "../../constant";
import {User} from "../../models/user";

@Injectable()
export class UserDal {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) {}

    /**
     * Find all user details by payload
     * @param payload
     * @return user list
     */
    async findAllByPayload(payload: any) :Promise<User[]> {
        return await this.userRepository.findAll(payload);
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

    /**
     * create user
     * @param payload
     * @return created user
     */
    async createUser(payload: any) {
        return this.userRepository.create(payload);
    }
}
