import {Module, Logger} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UserProvider} from "./users.provider";
import {UsersController} from "./users.controller";
import {UserDal} from "./users.dal";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UserDal, MainService, Logger,HelpersService, ...UserProvider],
    exports: [UsersService],
})
export class UsersModule {}
