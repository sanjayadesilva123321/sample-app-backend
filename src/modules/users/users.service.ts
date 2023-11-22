import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {Inject, Injectable, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {UserDal} from "./users.dal";
import {USER_REPOSITORY} from "../../constant";
import {User} from "../../models/user";
import {HelpersService} from "../../helpers/helpers.service";
import {Role} from "../../models/role";
import {UserLoginResponse, UserSignupResponse} from "../../types/services/post";

@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) private userRepository: typeof User,
        private userDal: UserDal,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
        private helperService : HelpersService,
    ) {}

    /**
     * create user
     * @param email
     * @param password
     * @return created user
     */
    async create(email: string, password: string): Promise<User> {
        try {
            return await this.userDal.createUser({
                email: email,
                password: password,
            });
        } catch (error) {
            this.logger.error("Error occurred :create user in user service: " + error);
            throw error;
        }
    }

    /**
     * hash password & create user with the given email & password
     * @param email
     * @param password
     * @return object with created user id and email
     */
    async userSignup(email: string, password: string):Promise<UserSignupResponse> {
        try {
            const hashedPassword : string = await this.hashPassword(password);
            const user : User = await this.create(email, hashedPassword);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                }
            };
        } catch (error) {
            this.logger.error("Error occurred :usersignup in user service: " + error);
            throw error;
        }
    }

    /**
     * Generate token for the user
     * @param user
     * @private
     * @return generated token
     */
    private generateToken(user: User): string {
        try {
            return jwt.sign(
                {id: user.id, username: user.email},
                this.configService.get<string>("JWT_SECRET_KEY"),
                {expiresIn: "1h"}
            );
        } catch (error) {
            this.logger.error("Error occurred :generateToken in user service: " + error);
            throw error;
        }
    }

    /**
     * generate user role token
     * @param user
     * @param userRoles
     * @private
     * @return generated role token
     */
    private generateRoleToken(user: User, userRoles: string[]): string {
        try {
            return jwt.sign(
                {id: user.id, username: user.email, roles: userRoles},
                this.configService.get<string>("ROLE_TOKEN_SECRET"),
                {expiresIn: "1h"}
            );
        } catch (error) {
            this.logger.error("Error occured :generateRoleToken in user service: " + error);
            throw error;
        }
    }

    /**
     * Get detail of user by email
     * @param email
     * @return User
     */
    async getUserDetailsByEmail(email: string): Promise<User> {
        return await this.userDal.findOne({
            where: {
                email: email,
            },
            attributes: ["id", "email", "password","role_id"],
        });
    }

    /**
     * hash user password
     * @param password
     * @return hashedPassword
     */
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * user login function
     * @param email
     * @param password
     * @param existingUser
     */
    async login(email: string, password: string, existingUser: User):Promise<UserLoginResponse> {
        try {
            const token = this.generateToken(existingUser);
            const userRoles = await this.getUserRoles(existingUser.role_id);
            const roleToken = this.generateRoleToken(existingUser, userRoles);
            return {
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                },
                ...{
                    token,
                    roleToken,
                },
            };
        } catch (error) {
            this.logger.error("Error occurred :login in user service: " + error);
            throw error;
        }
    }

    /**
     * validate given password of the user
     * @param plainPasswordText
     * @param hashedPassword
     * @return boolean
     */
    async validateUserPassword(plainPasswordText:string, hashedPassword:string):Promise<boolean> {
        try {
            return await bcrypt.compare(plainPasswordText, hashedPassword);
        } catch (error) {
            this.logger.error("Error occurred :validateUserPassword in user service: " + error);
            throw error;
        }
    }

    /**
     * get user role data from auth token
     * @param authtoken
     * @return array of user roles
     */
    async getUserRoleData(authtoken: string): Promise<string[]> {
        const user: any = await this.helperService.decodeJWTToken(authtoken);
        const roles = await Role.findAll({
            include: [
              {
                model: User,
                where: {
                  id: user.id
                },
                attributes: []
              }
            ],
            where: {},
            attributes: ['role']
          });
          return roles.map(roleObject => roleObject.role);
    }

    /**
     * get user role name from user role id
     * @param role_id
     * @return userRole array
     */
    async getUserRoles(role_id: number): Promise<string[]> {
        const role = await Role.findOne({
            where: {id:role_id},
        });
        return [role.role];
    }
}
