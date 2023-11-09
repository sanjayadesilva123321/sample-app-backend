import {Module, Logger} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";
import {UsersService} from "./users.service";
import {UserRoleService} from "../user-role/user-role.service";
import {MainService} from "../../utils/main/main.service";
import {UsersController} from "./users.controller";
import {UserProvider} from "./users.provider";
import {UserDal} from "./users.dal";
import {UserRoleDal} from "../user-role/user-role.dal";
import {AuthGuard} from "../../auth/auth.guard";
import {HelpersService} from "../../helpers/helpers.service";
@Module({
    controllers: [UsersController],
    providers: [...UserProvider, UsersService, UserDal, UserRoleService, UserRoleDal, MainService, Logger,HelpersService],
    exports: [UsersService],
})
export class UsersModule {}
