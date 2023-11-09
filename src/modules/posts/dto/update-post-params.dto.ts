import {IsDefined, IsNotEmpty, IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {PartialType} from "@nestjs/mapped-types";
import {CreatePostDto} from "./create-post.dto";

/**
 * Define update post request parameters
 * @param  roleId
 * @returns object
 */
export class UpdatePostParamsDto extends PartialType(CreatePostDto) {
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number;
}
