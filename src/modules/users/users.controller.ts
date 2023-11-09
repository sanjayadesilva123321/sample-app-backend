import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Logger} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Request, Response} from "express";
import {ResponseMessages} from "../../configs/response.messages";
import {ResponseCode} from "../../configs/response.codes";
import {UsersService} from "./users.service";
import {UserRoleService} from "../user-role/user-role.service";
import {MainService} from "../../utils/main/main.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {Public} from "../../auth/decorators/public.decorator";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly userRoleService: UserRoleService,
        private mainsService: MainService,
        private readonly logger: Logger
    ) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // @Get("/:id")
    // findOne(@Param("id") id: string) {
    //     console.log('dddd')
    //     return this.usersService.findOne(+id);
    // }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.usersService.remove(+id);
    }

    @Public()
    @Post("signup")
    @ApiResponse({status: ResponseCode.CREATED, description: ResponseMessages.CREATED})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: ResponseCode.DUPLICATE_USER, description: ResponseMessages.USER_ALREADY_EXISTS})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    @Post("signup")
    async signUp(@Req() request: Request, @Body() requestBody: CreateUserDto, @Res() response: Response) {
        try {
            const {email, password} = requestBody;
            const existingUser = await this.usersService.getUserDetailsByEmail(email);

            if (existingUser) {
                return this.mainsService.sendResponse(
                    response,
                    ResponseMessages.USER_ALREADY_EXISTS,
                    null,
                    false,
                    ResponseCode.UNPROCESSABLE_CONTENT,
                    ResponseCode.DUPLICATE_USER
                );
            }
            const signupResponse = await this.usersService.userSignup(email, password);

            return this.mainsService.sendResponse(
                response,
                ResponseMessages.CREATED,
                signupResponse,
                true,
                ResponseCode.CREATED
            );
        } catch (error: any) {
            this.logger.log("Error in creating user in user controller");
            this.logger.error("Error in user controller: " + error);
            this.mainsService.sendResponse(
                response,
                ResponseMessages.INTERNAL_SERVER_ERROR,
                error,
                false,
                ResponseCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Public()
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.SUCCESS})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: ResponseCode.FORBIDDEN, description: ResponseMessages.USER_NOT_EXISTS})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    @Post("login")
    async login(@Req() req, @Body() requestBody: UserLoginDto, @Res() response: Response) {
        try {
            const {email, password} = requestBody;
            const existingUser = await this.usersService.getUserDetailsByEmail(email);

            if (!existingUser) {
                return this.mainsService.sendResponse(
                    response,
                    ResponseMessages.USER_NOT_EXISTS,
                    null,
                    false,
                    ResponseCode.UNPROCESSABLE_CONTENT,
                    ResponseCode.USER_NOT_EXISTS
                );
            } else {
                const isPasswordValid = await this.usersService.validateUserPassword(password, existingUser.password);
                if (!isPasswordValid) {
                    return this.mainsService.sendResponse(
                        response,
                        ResponseMessages.USER_NOT_EXISTS,
                        null,
                        false,
                        ResponseCode.UNPROCESSABLE_CONTENT,
                        ResponseCode.USER_NOT_EXISTS
                    );
                } else {
                    const signupResponse = await this.usersService.login(email, password, existingUser);
                    return this.mainsService.sendResponse(
                        response,
                        ResponseMessages.SUCCESS,
                        signupResponse,
                        true,
                        ResponseCode.SUCCESS
                    );
                }
            }
        } catch (error: any) {
            this.logger.log("Error in use login in auth controller");
            this.logger.error("Error in auth controller: " + error);
            this.mainsService.sendResponse(
                response,
                ResponseMessages.INTERNAL_SERVER_ERROR,
                error,
                false,
                ResponseCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Public()
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.SUCCESS})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    @Get("roles")
    async getUserData(@Req() request: Request, @Res() response: Response) {
        try {
            const userRole = await this.usersService.getUserRoleData(request.headers.authorization);
            return this.mainsService.sendResponse(
                response,
                ResponseMessages.SUCCESS,
                userRole,
                true,
                ResponseCode.SUCCESS
            );
        } catch (error: any) {
            this.logger.log("Error in use login in auth controller");
            this.logger.error("Error in auth controller: " + error);
            this.mainsService.sendResponse(
                response,
                ResponseMessages.INTERNAL_SERVER_ERROR,
                error,
                false,
                ResponseCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
