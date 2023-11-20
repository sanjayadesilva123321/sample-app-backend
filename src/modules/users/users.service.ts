import {Inject, Injectable, Logger} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import {USER_REPOSITORY} from "../../constant/index";
import {User} from "../../models/user";
import {UserDal} from "./users.dal";
import {HelpersService} from "../../helpers/helpers.service";
import {Role} from "../../models/role";

@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) private userRepository: typeof User,
        private userDal: UserDal,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
        private helperService : HelpersService,
    ) {}

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

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    /**
     * hash password & create user with the given email & password
     * @param email
     * @param password
     */
    async userSignup(email: string, password: string) {
        try {
            const hashedPassword : string = await this.hashPassword(password);
            const user : User = await this.create(email, hashedPassword);
            const response = {
                user: {
                    id: user.id,
                    email: user.email,
                }
            };
            return response;
        } catch (error) {
            this.logger.error("Error occurred :usersignup in user service: " + error);
            throw error;
        }
    }

    /**
     * Generate token for the user
     * @param user
     * @private
     */
    private generateToken(user: User): string {
        try {
            const token = jwt.sign(
                {id: user.id, username: user.email},
                this.configService.get<string>("JWT_SECRET_KEY"),
                {expiresIn: "1h"}
            );
            return token;
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
     */
    private generateRoleToken(user: User, userRoles: string[]): string {
        try {
            const token = jwt.sign(
                {id: user.id, username: user.email, roles: userRoles},
                this.configService.get<string>("ROLE_TOKEN_SECRET"),
                {expiresIn: "1h"}
            );
            return token;
        } catch (error) {
            this.logger.error("Error occured :generateRoleToken in user service: " + error);
            throw error;
        }
    }

    /**
     * Get detail of user by email
     * @param email
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
     */
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    /**
     * user login function
     * @param email
     * @param password
     * @param existingUser
     */
    async login(email: string, password: string, existingUser: User) {
        try {
            const token = this.generateToken(existingUser);
            //const userRoles = await this.userRoleService.getUserRoles(existingUser.id);
            const userRoles = await this.getUserRoles(existingUser.role_id);
            const roleToken = this.generateRoleToken(existingUser, userRoles);
            const response = {
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                },
                ...{
                    token,
                    roleToken,
                },
            };
            return response;
        } catch (error) {
            this.logger.error("Error occured :login in user service: " + error);
            throw error;
        }
    }

    /**
     * validate given password of the user
     * @param plainPasswordText
     * @param hashedPassword
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
     */
    async getUserRoleData(authtoken: string): Promise<any> {
        const user: any = await this.helperService.decodeJWTToken(authtoken);
        console.log('getUserRoleData');
        console.log(user)
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
     */
    async getUserRoles(role_id: number): Promise<string[]> {
        const role = await Role.findOne({
            where: {id:role_id},
        });
        const userRoles =[role.role];
        return userRoles;
    }
}
