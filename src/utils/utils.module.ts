import {Global, Module} from "@nestjs/common";
import {MainService} from "./main/main.service";

@Global()
@Module({
    providers: [MainService],
    exports: [MainService],
})
export class UtilsModule {}