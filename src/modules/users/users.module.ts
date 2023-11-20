import {Module, Logger} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UserProvider} from "./users.provider";
import {UsersController} from "./users.controller";
import {UserDal} from "./users.dal";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";
// import model like UserRoleService

@Module({
    controllers: [UsersController],
    providers: [...UserProvider, UsersService, UserDal, MainService, Logger,HelpersService],
    exports: [UsersService],
})
export class UsersModule {}
