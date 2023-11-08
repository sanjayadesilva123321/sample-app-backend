import {Module, Logger} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {PostsService} from "./posts.service";
import {PostsController} from "./posts.controller";
import {MainService} from "../../utils/main/main.service";
import {PostDal} from "./posts.dal";
import {PostProvider} from "./posts.provider";
import {AuthGuard} from "../../auth/auth.guard";

@Module({
    controllers: [PostsController],
    providers: [
        ...PostProvider,
        PostsService,
        MainService,
        Logger,
        PostDal,
        JwtService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class PostsModule {}
