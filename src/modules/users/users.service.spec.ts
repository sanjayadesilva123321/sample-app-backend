import {Logger} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {ConfigService} from "@nestjs/config";
import * as bcrypt from "bcrypt";
import {UsersService} from "./users.service";
import {UserProvider} from "./users.provider";
import {UserDal} from "./users.dal";
import {User} from "../../models/user";
import {
    getUserDetailByEmailMockResponse,
    createUserMockBDResponse
} from "../../../test/references/services/user";
import {HelpersService} from "../../helpers/helpers.service";

jest.mock("../../helpers/helpers.service");
beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});
describe("UsersService", () => {
    let userservice: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                UserDal,
                Logger,
                HelpersService,
                ConfigService, ...UserProvider
            ],
        }).compile();
        userservice=module.get<UsersService>(UsersService);
   });
        
    it("should be defined", () => {
        expect(userservice).toBeDefined();
    });

    describe("create user", () => {
        it("create user", async () => {
            User.create = jest.fn().mockResolvedValue(createUserMockBDResponse);
            const result = await userservice.create("aa@gmail.com","abc@123");
            expect(result).toEqual(createUserMockBDResponse);
        });

        it("Exception throw", async () => {
            User.create = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(userservice.create("aa@gmail.com","abc@123")).rejects.toThrowError();
        });
    });

    describe("getUserDetailsByEmail", () => {
        it("should return user details by email", async () => {
            User.findOne = jest.fn().mockReturnValueOnce(getUserDetailByEmailMockResponse);
            const result = await userservice.getUserDetailsByEmail('aa4976655@gmail.com');
            expect(result).toEqual(getUserDetailByEmailMockResponse);
        });

        it("Exception throw", async () => {
            User.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(userservice.getUserDetailsByEmail('aa4976655@gmail.com')).rejects.toThrowError();
        });
    });

    describe("validateUserPassword", () => {
        it('should return true for valid password', async () => {
            const plainPassword = 'myPassword';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
            const result = await userservice.validateUserPassword(plainPassword, hashedPassword);
        
            expect(result).toBe(true);
        });

        it('should return false for invalid password', async () => {
            const plainPassword = 'myPassword';
            const anotherPassword = 'anotherPassword';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
            const result = await userservice.validateUserPassword(anotherPassword, hashedPassword);
        
            expect(result).toBe(false);
          });
    });

    // describe("get user role data", () => {
    //     it("should return user roles", async () => {
    //         (HelpersService.prototype.decodeJWTToken as jest.Mock).mockImplementation(async () => (
    //             {
    //                 id: '20004',
    //                 username: 'aa4977@gmail.com',
    //                 iat: 1699526134,
    //                 exp: 1699529734
    //               }
    //         ));

    //         User.findOne = jest.fn().mockReturnValueOnce(getUserDetailByEmailMockResponse);
    //         const result = await userservice.getUserDetailsByEmail('aa4976655@gmail.com');
    //         expect(result).toEqual(getUserDetailByEmailMockResponse);
    //     });

    //     it("Exception throw", async () => {
    //         User.findOne = jest.fn().mockImplementation(() => {
    //             throw new Error();
    //         });
    //         await expect(userservice.getUserDetailsByEmail('aa4976655@gmail.com')).rejects.toThrowError();
    //     });
    // });

    describe("login", () => {
        // it("should return user details of logged in user", async () => {
        //     User.findOne = jest.fn().mockReturnValueOnce(getUserDetailByEmailMockResponse);
        //     const result = await userservice.getUserDetailsByEmail('aa4976655@gmail.com');
        //     expect(result).toEqual(getUserDetailByEmailMockResponse);
        // });

        it("Exception throw", async () => {
            User.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(userservice.getUserDetailsByEmail('aa4976655@gmail.com')).rejects.toThrowError();
        });
    });

});