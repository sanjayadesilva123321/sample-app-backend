import {Test, TestingModule} from "@nestjs/testing";
import {PostsController} from "./posts.controller";
import {PostsService} from "./posts.service";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";
import {JwtService} from "@nestjs/jwt";
import {PostDal} from "./posts.dal";
import {AuthGuard} from "../../auth/auth.guard";
import {RolesGuard} from "../../auth/roles.guard";
import {mockRequest, mockResponse} from "../../helpers/unit.tests/unit.test.mock.helper";
import {ResponseCode} from "../../configs/response.codes";
import {ResponseMessages} from "../../configs/response.messages";
import {
    getPostsMockRequestParams,
    getPostsMockResponse

} from "../../../test/references/controllers/post";

jest.mock("./posts.service");
beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

describe("PostsController", () => {
    let postController: PostsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [PostsService,
                MainService,
                JwtService,
                HelpersService,
                PostDal,
                {provide: RolesGuard, useValue: jest.fn().mockImplementation(() => true)},
                {provide: AuthGuard, useValue: jest.fn().mockImplementation(() => true)},],
        }).compile();

        module.get<PostsService>(PostsService);
        postController = module.get<PostsController>(PostsController);
    });

    it("should be defined", () => {
        expect(postController).toBeDefined();
    });

    describe('findAll', () => {});

    describe("Get Posts by RoleId ", () => {
        const req = mockRequest();
        const res = mockResponse();
        it("should return an array activity log details", async () => {

            await postController.getPosts(req, getPostsMockRequestParams, res);
            expect(res.send).toHaveBeenCalledWith({
                code: ResponseCode.SUCCESS,
                data: getPostsMockResponse,
                message: ResponseMessages.SUCCESS,
                success: true,
            });
        });

        it("Catch an  error when fetch posts", async () => {
            (PostsService.prototype.getPosts as jest.Mock).mockImplementation(() => {
                throw Error();
            });

            await postController.getPosts(req, getPostsMockRequestParams, res);
            expect(res.status).toHaveBeenCalledWith(ResponseCode.INTERNAL_SERVER_ERROR);
        });

    });
});
