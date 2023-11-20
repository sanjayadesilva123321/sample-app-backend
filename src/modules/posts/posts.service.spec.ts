import {Logger} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {ConfigService} from "@nestjs/config";
import {PostsService} from "./posts.service";
import {PostDal} from "./posts.dal";
import {PostProvider} from "./posts.provider";
import {Post} from "../../models/post";
import {
    getPostsDataDBResponse,
} from "../../../test/references/services/post";

beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});
describe("PostsService", () => {
    let postservice: PostsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                PostDal,
                Logger,
                ConfigService, ...PostProvider
            ],
        }).compile();
        postservice=module.get<PostsService>(PostsService);
   });
        
    it("should be defined", () => {
        expect(postservice).toBeDefined();
    });

    describe("getPosts", () => {
        it("should return an array of posts", async () => {
            Post.findAll = jest.fn().mockReturnValueOnce(getPostsDataDBResponse);
            const result = await postservice.getPosts('Manager');
            expect(result).toEqual(getPostsDataDBResponse);
        });

        it("Exception throw", async () => {
            Post.findAll = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(postservice.getPosts('Admin')).rejects.toThrowError();
        });
    });

    describe("removePosts", () => {
        it("should delete post", async () => {
            Post.findOne = jest.fn().mockImplementation(() => ({dataValues: {id: 2,
                    title: 'updated title3',
                    content: 'test post content',
                    created_by: 10006,
                    updated_by: null}}));
            Post.destroy = jest.fn().mockImplementation(() => true);

            const result = await postservice.removePost(1002);
            expect(result).toEqual(undefined);
        });

        it("should show error when post does not exists", async () => {
            Post.findOne = jest.fn().mockReturnValueOnce(null);
            await expect(postservice.removePost(1003)).rejects.toThrowError();
        });

        it("Exception throw", async () => {
            Post.destroy = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(postservice.removePost(1003)).rejects.toThrowError();
        });
    });

    describe("update post by postId", () => {
        const postId = 1;
        it("should return updated post", async () => {

            Post.findOne = jest.fn().mockImplementation(() => ({dataValues: {id: 2,
                    title: 'updated title3',
                    content: 'test post content',
                    created_by: 10006,
                    updated_by: null}}));
            Post.update = jest.fn().mockImplementation(() => [1, [{}]]);

            const result = await postservice.updatePost(3, 'aaaa', 'bbbb');
            expect(result).toEqual({});
        });

        it("Exception throw", async () => {
            Post.update = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(postservice.updatePost(postId, 'aaaa', 'bbbb')).rejects.toThrowError();
        });
    });
});