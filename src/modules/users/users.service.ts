import {Inject, Injectable, Logger} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import {USER_REPOSITORY} from "../../constant/index";
import {UpdateUserDto} from "./dto/update-user.dto";
import {User} from "../../models/user";
import {UserDal} from "./users.dal";
import {UserRoleService} from "../user-role/user-role.service";
import {HelpersService} from "../../helpers/helpers.service";
import {Role} from "../../models/role";

@Injectable()
export class UsersService {
    constructor(
        private readonly userRoleService: UserRoleService,
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
            this.logger.error("Error occured :create user in user service: " + error);
            throw error;
        }
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async userSignup(email: string, password: string) {
        try {
            const hashedPassword = await this.hashPassword(password);
            const user = await this.create(email, hashedPassword);
            //const userRole = await this.userRoleService.create(user.id, ROLES.USER);
            const response = {
                user: {
                    id: user.id,
                    email: user.email,
                }
                // ,
                // ...{
                //     role: userRole,
                // },
            };
            return response;
        } catch (error) {
            this.logger.error("Error occured :usersignup in user service: " + error);
            throw error;
        }
    }

    private generateToken(user: User): string {
        try {
            const token = jwt.sign(
                {id: user.id, username: user.email},
                this.configService.get<string>("JWT_SECRET_KEY"),
                {expiresIn: "1h"}
            );
            return token;
        } catch (error) {
            this.logger.error("Error occured :generateToken in user service: " + error);
            throw error;
        }
    }

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

    async getUserDetailsByEmail(email: string): Promise<User> {
        return await this.userDal.findOne({
            where: {
                email: email,
            },
            attributes: ["id", "email", "password","role_id"],
        });
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    async login(email: string, password: string, existingUser: User) {
        try {
            const token = this.generateToken(existingUser);
            //const userRoles = await this.userRoleService.getUserRoles(existingUser.id);
            const userRoles = await this.userRoleService.getUserRoles(existingUser.role_id);
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

    async validateUserPassword(plainPasswordText, hashedPassword) {
        try {
            return await bcrypt.compare(plainPasswordText, hashedPassword);
        } catch (error) {
            this.logger.error("Error occured :validateUserPassword in user service: " + error);
            throw error;
        }
    }

    async getUserRoleData(authtoken: string): Promise<any> {
        const user: any = await this.helperService.decodeJWTToken(authtoken);
        return await Role.findAll({
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
    }
}
