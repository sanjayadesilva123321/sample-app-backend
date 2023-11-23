import {Inject, Injectable} from "@nestjs/common";
import {USER_REPOSITORY} from "../../constant";
import {User} from "../../models/user";

@Injectable()
export class UserDal {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) {}

     /**
     * Find user by payload
     * @param payload
     * @returns user object
     */
    async findOne(payload: any):Promise<User> {
        return this.userRepository.findOne(payload);
    }

    /**
     * create user
     * @param payload
     * @return created user
     */
    async createUser(payload: any) :Promise<User> {
        return this.userRepository.create(payload);
    }
}
