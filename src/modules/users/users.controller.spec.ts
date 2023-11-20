import {Logger} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {JwtService} from "@nestjs/jwt";
import {beforeEach, describe, expect} from "@jest/globals";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";
import {ConfigService} from "@nestjs/config";
import {mockRequest, mockResponse} from "../../helpers/unit.tests/unit.test.mock.helper";
import {ResponseCode} from "../../configs/response.codes";
import {ResponseMessages} from "../../configs/response.messages";
import {
    getUserDetailEmailByMockResponse,
    userSIgnupMockResponse,
    getUserDetailEmailByMockResponseForNoUsers,
    loginUserMockResponse,
    //getUserRoleDataSuccessResponse
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
                userSIgnupMockResponse
            ));

            const result : any=  await userController.signUp(req,{email:'aa85455@gmail.com', password:'abcf@122'}, res);
            expect(result.send).toBeCalledWith({
                code: ResponseCode.CREATED,
                data: userSIgnupMockResponse,
                message: ResponseMessages.CREATED,
                success: true,
            });
        });

        // it("should return user exists error", async () => {
        //     (UsersService.prototype.getUserDetailsByEmail as jest.Mock).mockImplementation(async () => (
        //         getUserDetailEmailByMockResponse
        //     ));

        //     const result : any=  await userController.signUp(req,{email:'aa85455@gmail.com', password:'abcf@122'}, res);
        //     console.log('RESULT==========');
        //     console.log(result)
        //     expect(result.send).toBeCalledWith({
        //         code: ResponseCode.DUPLICATE_USER,
        //         data: null,
        //         message: ResponseMessages.USER_ALREADY_EXISTS,
        //         success: false,
        //     });
        // });

        it("Exception throw", async () => {
            (UsersService.prototype.userSignup as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
           await userController.signUp(req, {email:'aa85455@gmail.com', password:'abcf@122'}, res);
            expect(res.status).toBeCalledWith(ResponseCode.INTERNAL_SERVER_ERROR);
        });

    });

    describe('login', () => {
        const req = mockRequest();
        const res = mockResponse();

        it("should login", async () => {

            (UsersService.prototype.getUserDetailsByEmail as jest.Mock).mockImplementation(async () => (
                getUserDetailEmailByMockResponse
            ));

            (UsersService.prototype.validateUserPassword as jest.Mock).mockImplementation(async () => (
                true
            ));

            (UsersService.prototype.login as jest.Mock).mockImplementation(async () => (
                loginUserMockResponse
            ));

            const result : any=  await userController.login(req,{email:'aa4976655@gmail.com', password:'abcf@122'}, res);

            expect(result.send).toBeCalledWith({
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

            const result : any=  await userController.login(req,{email:'aa4976655@gmail.com', password:'abcf@122'}, res);

            expect(result.send).toBeCalledWith({
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

            (UsersService.prototype.validateUserPassword as jest.Mock).mockImplementation(async () => (
                false
            ));

            const result : any=  await userController.login(req,{email:'aa4976655@gmail.com', password:'abcf@122'}, res);

            expect(result.send).toBeCalledWith({
                code: ResponseCode.USER_NOT_EXISTS,
                data: null,
                message: ResponseMessages.USER_NOT_EXISTS,
                success: false,
            });
        });

        // it("Exception throw", async () => {
        //     (UsersService.prototype.login as jest.Mock).mockImplementation(() => {
        //         throw new Error();
        //     });
        //    await userController.login(req, {email:'aa85455@gmail.com', password:'abcf@122'}, res);           
        //    expect(res.status).toBeCalledWith(ResponseCode.INTERNAL_SERVER_ERROR);
        // });

    });

    describe('get user roles of the user from auth token', () => {
        const req = mockRequest();
        const res = mockResponse();

        req.headers.authorization='x'

        // it("should get user roles", async () => {

        //     (UsersService.prototype.getUserRoleData as jest.Mock).mockImplementation(async () => (
        //         getUserRoleDataSuccessResponse
        //     ));
        //     const updateResponse: any = await userController.getUserData(
        //         req,  
        //         res);
        //     console.log('updateResponse===========');
        //     console.log(updateResponse)   

        //     expect(updateResponse.send).toBeCalledWith({
        //         code: ResponseCode.SUCCESS,
        //         data: updateResponse,
        //         message: ResponseMessages.SUCCESS,
        //         success: true,
        //     });
        // });

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
