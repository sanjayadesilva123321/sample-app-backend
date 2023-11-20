import {Module, Logger} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {PostsService} from "./posts.service";
import {PostsController} from "./posts.controller";
import {PostDal} from "./posts.dal";
import {PostProvider} from "./posts.provider";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";
import {AuthGuard} from "../../auth/auth.guard";
import {RolesGuard} from "../../auth/roles.guard";

@Module({
    controllers: [PostsController],
    providers: [
        ...PostProvider,
        PostsService,
        MainService,
        Logger,
        PostDal,
        JwtService,
        HelpersService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [PostsService]
})
export class PostsModule {}
