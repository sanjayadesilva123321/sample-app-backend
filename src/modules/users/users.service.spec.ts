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
    let usersService: UsersService;

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
        usersService=module.get<UsersService>(UsersService);
   });
        
    it("should be defined", () => {
        expect(usersService).toBeDefined();
    });

    describe("create user", () => {
        it("create user", async () => {
            User.create = jest.fn().mockResolvedValue(createUserMockBDResponse);
            const result : User = await usersService.create("aa@gmail.com","abc@123");
            expect(result).toEqual(createUserMockBDResponse);
        });

        it("Exception throw", async () => {
            User.create = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(usersService.create("aa@gmail.com","abc@123")).rejects.toThrowError();
        });
    });

    describe("getUserDetailsByEmail", () => {
        it("should return user details by email", async () => {
            User.findOne = jest.fn().mockReturnValueOnce(getUserDetailByEmailMockResponse);
            const result : User = await usersService.getUserDetailsByEmail('aa4976655@gmail.com');
            expect(result).toEqual(getUserDetailByEmailMockResponse);
        });

        it("Exception throw", async () => {
            User.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(usersService.getUserDetailsByEmail('aa4976655@gmail.com')).rejects.toThrowError();
        });
    });

    describe("validateUserPassword", () => {
        it('should return true for valid password', async () => {
            const plainPassword = 'myPassword';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
            const result = await usersService.validateUserPassword(plainPassword, hashedPassword);
        
            expect(result).toBe(true);
        });

        it('should return false for invalid password', async () => {
            const plainPassword = 'myPassword';
            const anotherPassword = 'anotherPassword';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
            const result = await usersService.validateUserPassword(anotherPassword, hashedPassword);
        
            expect(result).toBe(false);
          });
    });

    describe("login", () => {
        it("Exception throw", async () => {
            User.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            await expect(usersService.getUserDetailsByEmail('aa4976655@gmail.com')).rejects.toThrowError();
        });
    });

});