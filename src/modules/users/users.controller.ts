import {Request, Response} from "express";
import {Controller, Get, Post, Body, Req, Res, Logger} from "@nestjs/common";
import {ApiBearerAuth, ApiHeader, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UsersService} from "./users.service";
import {CreateUserDto, UserLoginDto} from "./dto/user.dto";
import {ResponseMessages} from "../../configs/response.messages";
import {ResponseCode} from "../../configs/response.codes";
import {MainService} from "../../utils/main/main.service";
import {Public} from "../../auth/decorators/public.decorator";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private mainsService: MainService,
        private readonly logger: Logger
    ) {}

    /**
     * user signup
     *      This is for user signup
     *      Check whether user signup has public access
     *
     * Sample Request
     *      - Request Body
     *          - {
     *              "email": "test1@gmail.com",
     *              "password":"abc@123"
     *            }
     * @param request
     * @param requestBody
     * @param response
     * @return created user object
     */
    @Public()
    @Post("signup")
    @ApiResponse({status: ResponseCode.CREATED, description: ResponseMessages.CREATED})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: ResponseCode.DUPLICATE_USER, description: ResponseMessages.USER_ALREADY_EXISTS})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    @Post("signup")
    async signUp(@Req() request: Request, @Body() requestBody: CreateUserDto, @Res() response: Response): Promise<void> {
        try {
            const {email, password} = requestBody;
            const existingUser = await this.usersService.getUserDetailsByEmail(email);

            if (existingUser) {
                this.mainsService.sendResponse(
                    response,
                    ResponseMessages.USER_ALREADY_EXISTS,
                    null,
                    false,
                    ResponseCode.DUPLICATE_USER,
                    ResponseCode.DUPLICATE_USER
                );
            }
            const signupResponse = await this.usersService.userSignup(email, password);

            this.mainsService.sendResponse(
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

    /**
     * user login
     *      This is for user login
     *      Check whether user login has public access
     *
     * Sample Request
     *      - Request Body
     *          - {
     *              "email": "test1@gmail.com",
     *              "password":"abc@123"
     *            }
     * @param req
     * @param requestBody
     * @param response
     * @return logged in user details with auth token & role token
     */
    @Public()
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.SUCCESS})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: ResponseCode.FORBIDDEN, description: ResponseMessages.USER_NOT_EXISTS})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    @Post("login")
    async login(@Req() req, @Body() requestBody: UserLoginDto, @Res() response: Response): Promise<void> {
        try {
            const {email, password} = requestBody;
            const existingUser = await this.usersService.getUserDetailsByEmail(email);
            if (!existingUser) {
                this.mainsService.sendResponse(
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
                    this.mainsService.sendResponse(
                        response,
                        ResponseMessages.USER_NOT_EXISTS,
                        null,
                        false,
                        ResponseCode.UNPROCESSABLE_CONTENT,
                        ResponseCode.USER_NOT_EXISTS
                    );
                } else {
                    const signupResponse = await this.usersService.login(email, password, existingUser);
                    this.mainsService.sendResponse(
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

    /**
     * get user role data from authorization token
     *      This will return user role from the authorization token
     *      Check whether only logged-in users has permissions to access this
     *
     * Sample Request
     *      - Headers
     *          - Authorization Token
     * @param request
     * @param response
     * @return user roles array of the user
     */
    @ApiBearerAuth()
    @ApiHeader({
        name: "authorization",
        description: "authorization Token",
        required: true
    })
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.SUCCESS})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    @Get("roles")
    async getUserData(@Req() request: Request, @Res() response: Response):Promise<void> {
        try {
            const userRole = await this.usersService.getUserRoleData(request.headers.authorization);
            this.mainsService.sendResponse(
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
