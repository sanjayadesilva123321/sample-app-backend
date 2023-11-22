import {Module, Logger} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {PostsService} from "./posts.service";
import {PostsController} from "./posts.controller";
import {PostDal} from "./posts.dal";
import {PostProvider} from "./posts.provider";
import {MainService} from "../../utils/main/main.service";
import {HelpersService} from "../../helpers/helpers.service";

@Module({
    controllers: [PostsController],
    providers: [
        PostsService,
        MainService,
        Logger,
        PostDal,
        JwtService,
        HelpersService,
        ...PostProvider,
    ],
    exports: [PostsService]
})
export class PostsModule {}
