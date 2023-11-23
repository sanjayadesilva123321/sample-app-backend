import {UseGuards, Controller, Get, Body, Patch, Param, Delete, Req, Res, Logger} from "@nestjs/common";
import {ApiResponse, ApiTags, ApiBearerAuth, ApiHeader} from "@nestjs/swagger";
import {Request, Response} from "express";
import {PostsService} from "./posts.service";
import {UpdatePostDto, UpdatePostParamsDto} from "./dto/post.dto";
import {ResponseMessages} from "../../configs/response.messages";
import {ResponseCode} from "../../configs/response.codes";
import {MainService} from "../../utils/main/main.service";
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../auth/decorators/roles.decorator";
import { ROLE } from '../../constant';
import {HelpersService} from "../../helpers/helpers.service";
import { Post } from "../../models/post";

@ApiTags("Posts")
@ApiBearerAuth()
@ApiHeader({
    name: "role-token",
    description: "Role Token",
    required: true
})
@Controller("Posts")
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly logger: Logger,
        private mainsService: MainService,
        private helperService : HelpersService
    ) {}

    /**
     *
     * Get posts list available for the logged-in user
     *      This will retrieve posts available for the logged-in user
     *      Check whether Admin & manager user roles has permissions to access this
     *
     * Sample Request
     *      - Headers
     *          - Authorization Token
     *          - Role Token
     * @param request
     * @param response
     * @return array of posts
     */
    @UseGuards(AuthGuard)
    @Roles(ROLE.Admin, ROLE.Manager)
    @Get("")
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.DATA_FOUND})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 403, description: "Forbidden"})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    public async getPosts(@Req() request: Request, @Res() response: Response):Promise<void> {
        try {
            const roleToken: any = request.headers['role-token'];
            const user: any = await this.helperService.decodeJWTToken(roleToken);
            const posts :Post[] = await this.postsService.getPosts(user.roles[0]);
            this.mainsService.sendResponse(
                response,
                ResponseMessages.SUCCESS,
                posts,
                true,
                ResponseCode.SUCCESS
            );
        } catch (error) {
            this.logger.log("Error in getting posts in posts controller");
            this.logger.error("Error in posts controller: " + error);
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
     * Update Post by given post ID
     *      This will update the post of the given ID
     *      Check whether Admin & manager user roles has permissions to access this
     *
     * Sample Request
     *      - Headers
     *          - Authorization Token
     *          - Role Token
     *      - params
     *          - id : PostId <number>
     * @param params
     * @param requestBody
     * @param response
     * @return updated Post
     */
    @UseGuards(AuthGuard)
    @Roles(ROLE.Admin, ROLE.Manager)
    @Patch(":id")
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.DATA_FOUND})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 403, description: "Forbidden"})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    public async update(
        @Param() params: UpdatePostParamsDto,
        @Body() requestBody: UpdatePostDto,
        @Res() response: Response
    ):Promise<void> {
        try {
            const {title, content} = requestBody;
            const updateStatus:Post = await this.postsService.updatePost(params.id, title, content);
            this.mainsService.sendResponse(
                response,
                ResponseMessages.SUCCESS,
                updateStatus,
                true,
                ResponseCode.SUCCESS
            );
        } catch (error) {
            this.logger.log("Error in updating post in posts controller");
            this.logger.error("Error in posts controller: " + error);
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
     * Delete post by given post id
     *      This will delete the post of the given ID
     *      Check whether only Admin user role has permissions to access this
     *
     * Sample Request
     *      - Headers
     *          - Authorization Token
     *          - Role Token
     *      - params
     *          - id : PostId <number>
     * @param request
     * @param params
     * @param response
     * @return {} when post deleted successfully
     */
    @Roles(ROLE.Admin)
    @Delete(":id")
    @ApiResponse({status: 200, description: "Delete successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Internal server error"})
    public async deletePost(@Req() request: Request, @Param() params: UpdatePostParamsDto, @Res() response: Response):Promise<void> {
        try {
            await this.postsService.removePost(params.id);
            this.mainsService.sendResponse(
                response,
                ResponseMessages.DELETE_SUCCESS,
                {},
                true,
                ResponseCode.SUCCESS
            );
        } catch (error: any) {
            this.logger.error("Error in post controller: " + error);
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
