import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "./database/database.module";
import {PostsModule} from "./modules/posts/posts.module";
import {UsersModule} from "./modules/users/users.module";
import {AuthModule} from "./auth/auth.module";
@Module({
    imports: [
        ConfigModule.forRoot({ // go through forRoot why use
            isGlobal: true,
        }),
        DatabaseModule,
        PostsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
