import {Global, Module, Logger} from "@nestjs/common";
import {HelpersService} from "./helpers.service";

@Global()
@Module({
    providers: [HelpersService, Logger],
    exports: [HelpersService],
})
export class HelpersModule {}