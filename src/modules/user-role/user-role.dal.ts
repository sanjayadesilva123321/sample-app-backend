import {Inject, Injectable} from "@nestjs/common";
import {USER_ROLE_REPOSITORY} from "../../constant/index";
import {UserRole} from "../../models/user-role";

@Injectable()
export class UserRoleDal {
    constructor(@Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepository: typeof UserRole) {}

    /**
     * Find all user-role details by payload
     * @param payload
     */
    async findAllByPayload(payload: any) {
        try {
            return await this.userRoleRepository.findAll(payload);
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
            return await this.userRoleRepository.findOne(payload);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async createUserRole(payload: any) {
        return this.userRoleRepository.create(payload);
    }
}
