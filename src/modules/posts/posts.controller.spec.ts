import {Logger} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {beforeEach, describe, expect} from "@jest/globals";
import {PostsController} from "./posts.controller";
import {PostsService} from "./posts.service";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";
import {mockRequest, mockResponse} from "../../helpers/unit-tests/unit.test.mock.helper";
import {ResponseCode} from "../../configs/response.codes";
import {ResponseMessages} from "../../configs/response.messages";
import {
    getPostsMockResponse,
    getPostUpdateMockResponse,
} from "../../../test/references/controllers/post";

jest.mock("./posts.service");
jest.mock("../../helpers/helpers.service");
beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

describe("PostsController", () => {
    let postController: PostsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [
                PostsService,
                MainService,                
                HelpersService,
                Logger,
                ConfigService,
                JwtService,
            ],
        }).compile();
        postController = module.get<PostsController>(PostsController);
    });

    it("should be defined", () => {
        expect(postController).toBeDefined();
    });


    describe('findAll', () => {
        const req = mockRequest();
        const res = mockResponse();
        req.headers['role-token']='a';

        it("should return an array of posts", async () => {


            (PostsService.prototype.getPosts as jest.Mock).mockImplementation(async () => (
                getPostsMockResponse
            ));

            (HelpersService.prototype.decodeJWTToken as jest.Mock).mockImplementation(async () => (
                {
                    'roles':['Admin']
                }
            ));
            const result : any=  await postController.getPosts(req, res);
            expect(result.send).toBeCalledWith({
                code: ResponseCode.SUCCESS,
                data: getPostsMockResponse,
                message: ResponseMessages.SUCCESS,
                success: true,
            });
        });

        it("Exception throw", async () => {
            (PostsService.prototype.getPosts as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
           await postController.getPosts(req, res);
            expect(res.status).toBeCalledWith(ResponseCode.INTERNAL_SERVER_ERROR);
        });

    });

    describe('updatePost', () => {
        const res = mockResponse();

        it("should update post title and content", async () => {

            (PostsService.prototype.updatePost as jest.Mock).mockImplementation(async () => (
                getPostUpdateMockResponse
            ));
            const updateResponse: any = await postController.update(
                {id:1002},
                {title: "title", content:'post content'},    
                res);
            expect(updateResponse.send).toBeCalledWith({
                code: ResponseCode.SUCCESS,
                data: getPostUpdateMockResponse,
                message: ResponseMessages.SUCCESS,
                success: true,
            });
        });

        it("Exception throw", async () => {
            (PostsService.prototype.updatePost as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
           await postController.update(
            {id:1002},
            {title: "title", content:'post content'},    
            res);
            expect(res.status).toBeCalledWith(ResponseCode.INTERNAL_SERVER_ERROR);
        });

    });

    describe('deletePost', () => {
        const req = mockRequest();
        const res = mockResponse();

        it("should delete post", async () => {

            (PostsService.prototype.removePost as jest.Mock).mockImplementation(async () => (
                {}
            ));
            const updateResponse: any = await postController.deletePost(
                req,
                {id:1002},   
                res);
            expect(updateResponse.send).toBeCalledWith({
                code: ResponseCode.SUCCESS,
                data: {},
                message: ResponseMessages.DELETE_SUCCESS,
                success: true,
            });
        });

        it("Exception throw", async () => {
            (PostsService.prototype.removePost as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
           await postController.deletePost(
            req,
            {id:1002},   
            res);
            expect(res.status).toBeCalledWith(ResponseCode.INTERNAL_SERVER_ERROR);
        });

    });
});
