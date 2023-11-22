import {Module} from "@nestjs/common";
import {APP_GUARD} from "@nestjs/core";
import {ConfigModule} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {DatabaseModule} from "./database/database.module";
import {PostsModule} from "./modules/posts/posts.module";
import {UsersModule} from "./modules/users/users.module";
import {HelpersModule} from "./helpers/helpers.module";
import {UtilsModule} from "./utils/utils.module";
import {AuthModule} from "./auth/auth.module";
import {AuthGuard} from "./auth/auth.guard";
import {RolesGuard} from "./auth/roles.guard";
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        PostsModule,
        UsersModule,
        AuthModule,
        HelpersModule,
        UtilsModule
    ],
    controllers: [],
    providers: [
        JwtService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
