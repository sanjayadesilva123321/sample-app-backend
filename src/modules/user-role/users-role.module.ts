import {Module} from "@nestjs/common";
import {UserRoleService} from "./user-role.service";
//import { UsersController } from './users.controller';
import {UserRoleProvider} from "./user-role.provider";
import {UserRoleDal} from "./user-role.dal";

@Module({
    controllers: [],
    providers: [...UserRoleProvider, UserRoleService, UserRoleDal],
})
export class UserRoleModule {}
