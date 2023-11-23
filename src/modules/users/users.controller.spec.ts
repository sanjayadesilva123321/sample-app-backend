import {Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Test, TestingModule} from "@nestjs/testing";
import {JwtService} from "@nestjs/jwt";
import {beforeEach, describe, expect} from "@jest/globals";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";
import {mockRequest, mockResponse} from "../../helpers/unit-tests/unit.test.mock.helper";
import {ResponseCode} from "../../configs/response.codes";
import {ResponseMessages} from "../../configs/response.messages";
import {
    getUserDetailEmailByMockResponse,
    userSignupMockResponse,
    getUserDetailEmailByMockResponseForNoUsers,
    loginUserMockResponse,
    getUserRoleDataSuccessResponse
} from "../../../test/references/controllers/user";

jest.mock("./users.service");
jest.mock("../../helpers/helpers.service");
beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

describe("UsersController", () => {
    let userController: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                MainService,                
                HelpersService,
                Logger,
                ConfigService,
                JwtService,
            ],
        }).compile();

        userController = module.get<UsersController>(UsersController);
    });

    it("should be defined", () => {
        expect(userController).toBeDefined();
    });

    describe('signup', () => {
        const req = mockRequest();
        const res = mockResponse();

        it("should return signed up user detail", async () => {
            (UsersService.prototype.getUserDetailsByEmail as jest.Mock).mockImplementation(async () => (
                getUserDetailEmailByMockResponseForNoUsers
            ));

            (UsersService.prototype.userSignup as jest.Mock).mockImplementation(async () => (
                userSignupMockResponse
            ));

            await userController.signUp(req,{email:'aa85455@gmail.com', password:'abcf@122'}, res);
            expect(res.send).toBeCalledWith({
                code: ResponseCode.CREATED,
                data: userSignupMockResponse,
                message: ResponseMessages.CREATED,
                success: true,
            });
        });

        it("should return user exists error", async () => {
            (UsersService.prototype.getUserDetailsByEmail as jest.Mock).mockImplementation(async () => (
                getUserDetailEmailByMockResponse
            ));

            await userController.signUp(req,{email:'aa85455@gmail.com', password:'abcf@122'}, res);
            expect(res.send).toBeCalledWith({
                code: ResponseCode.DUPLICATE_USER,
                data: null,
                message: ResponseMessages.USER_ALREADY_EXISTS,
                success: false,
            });
        });

        it("Exception throw", async () => {
            (UsersService.prototype.userSignup as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
           await userController.signUp(req, {email:'aa85455@gmail.com', password:'abcf@122'}, res);
            expect(res.status).toBeCalledWith(ResponseCode.DUPLICATE_USER);
        });

    });

    describe('login', () => {
        const res = mockResponse();

        it("should login", async () => {

            (UsersService.prototype.getUserDetailsByEmail as jest.Mock).mockImplementation(async () => (
                getUserDetailEmailByMockResponse
            ));

            (UsersService.prototype.validateUserPassword as jest.Mock).mockImplementation(async () => true);

            (UsersService.prototype.login as jest.Mock).mockImplementation(async () => (
                loginUserMockResponse
            ));

            await userController.login({email:'aa4976655@gmail.com', password:'abcf@122'}, res);

            expect(res.send).toBeCalledWith({
                code: ResponseCode.SUCCESS,
                data: loginUserMockResponse,
                message: ResponseMessages.SUCCESS,
                success: true,
            });
        });

        it("should show error message when user does not exists", async () => {

            (UsersService.prototype.getUserDetailsByEmail as jest.Mock).mockImplementation(async () => (
                getUserDetailEmailByMockResponseForNoUsers
            ));

            await userController.login({email:'aa4976655@gmail.com', password:'abcf@122'}, res);

            expect(res.send).toBeCalledWith({
                code: ResponseCode.USER_NOT_EXISTS,
                data: null,
                message: ResponseMessages.USER_NOT_EXISTS,
                success: false,
            });
        });

        it("should show error message when user password in invalid", async () => {

            (UsersService.prototype.getUserDetailsByEmail as jest.Mock).mockImplementation(async () => (
                getUserDetailEmailByMockResponse
            ));

            (UsersService.prototype.validateUserPassword as jest.Mock).mockImplementation(async () => false);

            await userController.login({email:'aa4976655@gmail.com', password:'abcf@122'}, res);

            expect(res.send).toBeCalledWith({
                code: ResponseCode.USER_NOT_EXISTS,
                data: null,
                message: ResponseMessages.USER_NOT_EXISTS,
                success: false,
            });
        });

    });

    describe('get user roles of the user from auth token', () => {
        const req = mockRequest();
        const res = mockResponse();

        req.headers.authorization='x'

        it("should get user roles", async () => {

            (UsersService.prototype.getUserRoleData as jest.Mock).mockReturnValueOnce(
                getUserRoleDataSuccessResponse
            );
            await userController.getUserData(req, res);
            expect(res.send).toHaveBeenCalledWith({
                code: ResponseCode.SUCCESS,
                data: getUserRoleDataSuccessResponse,
                message: ResponseMessages.SUCCESS,
                success: true,
            });
        });

        it("Exception throw", async () => {
            (UsersService.prototype.getUserRoleData as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
           await userController.getUserData(
            req, 
            res);
            expect(res.status).toBeCalledWith(ResponseCode.INTERNAL_SERVER_ERROR);
        });

    });
});
