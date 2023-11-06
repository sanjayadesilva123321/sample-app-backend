import { UseGuards, Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Logger } from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {ApiResponse, ApiTags, ApiBearerAuth, ApiHeader} from "@nestjs/swagger";
import {Request, Response} from "express";
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {ResponseMessages} from "../../configs/response.messages";
import {ResponseCode} from "../../configs/response.codes";
import { MainService} from "../../utils/main/main.service";
import { ListPostsDto } from './dto/get-post.dto';

@ApiTags("Posts")
@ApiBearerAuth("access-token")
@ApiHeader({
    name: "role-token",
    description: "Role Token",
})
@Controller("Posts")
export class PostsController {
  constructor(private readonly postsService: PostsService,
    private readonly logger: Logger,
    private mainsService: MainService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @UseGuards(AuthGuard())
  @Get("/list/:roleId")
  @ApiResponse({status: ResponseCode.SUCCESS, description: ResponseMessages.DATA_FOUND})
  @ApiResponse({status: 400, description: "Bad Request"})
  @ApiResponse({status: 401, description: "Unauthorized"})
  @ApiResponse({status: 403, description: "Forbidden"})
  @ApiResponse({status: ResponseCode.INTERNAL_SERVER_ERROR, description: ResponseMessages.INTERNAL_SERVER_ERROR})
    public async getPosts(
        @Req() request: Request,
        @Param() params: ListPostsDto,
        @Res() response: Response
    ) {
      try {
        const syncStatus = await this.postsService.getPosts(
          params.roleId
      );
      return this.mainsService.sendResponse(
          response,
          ResponseMessages.SUCCESS,
          syncStatus,
          true,
          ResponseCode.SUCCESS
      );
      } catch (error) {
        this.logger.log("Error in getting posts in posts controller");
        this.logger.error("Error in posts controller: "+ error)
        this.mainsService.sendResponse(
            response,
            ResponseMessages.INTERNAL_SERVER_ERROR,
            error,
            false,
            ResponseCode.INTERNAL_SERVER_ERROR
        );
      }
      
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
