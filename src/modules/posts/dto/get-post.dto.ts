import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

/**
 * Define get post request parameters
 * @param  roleId
 * @returns object
 */
export class ListPostsDto {
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    roleId: number;
}
