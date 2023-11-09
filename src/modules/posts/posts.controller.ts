import {UseGuards, Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Logger} from "@nestjs/common";
import {ApiResponse, ApiTags, ApiBearerAuth, ApiHeader} from "@nestjs/swagger";
import {Request, Response} from "express";
import {PostsService} from "./posts.service";
import {CreatePostDto} from "./dto/create-post.dto";
import {UpdatePostDto} from "./dto/update-post.dto";
import {ResponseMessages} from "../../configs/response.messages";
import {ResponseCode} from "../../configs/response.codes";
import {MainService} from "../../utils/main/main.service";
import {UpdatePostParamsDto} from "./dto/update-post-params.dto";
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../auth/decorators/roles.decorator";
import { Role } from '../../auth/role.enum';
import {HelpersService} from "../../helpers/helpers.service";

@ApiTags("Posts")
@ApiBearerAuth()
@ApiHeader({
    name: "role-token",
    description: "Role Token",
})
@Controller("Posts")
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly logger: Logger,
        private mainsService: MainService,
        private helperService : HelpersService
    ) {}

    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @UseGuards(AuthGuard)
    @Roles(Role.Admin, Role.Manager) 
    @Get("")
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.DATA_FOUND})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 403, description: "Forbidden"})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    public async getPosts(@Req() request: Request, @Res() response: Response) {
        try {
            const roleToken: any = request.headers['role-token'];
            const user: any = await this.helperService.decodeJWTToken(roleToken);
            const syncStatus = await this.postsService.getPosts(user.roles[0]);
            return this.mainsService.sendResponse(
                response,
                ResponseMessages.SUCCESS,
                syncStatus,
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

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.postsService.findOne(+id);
    }

    //@UseGuards(AuthGuard)
    @Roles(Role.Admin, Role.Manager)
    @Patch(":id")
    @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.DATA_FOUND})
    @ApiResponse({status: 400, description: "Bad Request"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 403, description: "Forbidden"})
    @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    public async update(
        @Req() request: Request,
        @Param() params: UpdatePostParamsDto,
        @Body() requestBody: UpdatePostDto,
        @Res() response: Response
    ) {
        try {
            const {title, content} = requestBody;
            const updateStatus = await this.postsService.updatePost(params.id, title, content);
            return this.mainsService.sendResponse(
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

    @Roles(Role.Admin)
    @Delete(":id")
    @ApiResponse({status: 200, description: "Delete successfully"})
    @ApiResponse({status: 401, description: "Unauthorized"})
    @ApiResponse({status: 500, description: "Internal server error"})
    public async deletePost(@Req() request: Request, @Param() params: UpdatePostParamsDto, @Res() response: Response) {
        try {
            await this.postsService.removePost(params.id);

            return this.mainsService.sendResponse(
                response,
                ResponseMessages.DELETE_SUCCESS,
                {},
                true,
                ResponseCode.SUCCESS
            );
        } catch (error: any) {
            this.logger.error("Error in post controller: " + error);
            return this.mainsService.sendResponse(
                response,
                ResponseMessages.INTERNAL_SERVER_ERROR,
                error,
                false,
                ResponseCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
