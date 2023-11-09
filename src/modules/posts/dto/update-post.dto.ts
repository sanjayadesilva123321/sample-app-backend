import {IsAlphanumeric, IsDefined, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {PartialType} from "@nestjs/mapped-types";
import {CreatePostDto} from "./create-post.dto";

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsDefined()
    @IsNotEmpty()
    @IsAlphanumeric()
    @ApiProperty()
    content: string;
}
