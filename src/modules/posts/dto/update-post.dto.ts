import {IsDefined, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform, Type} from "class-transformer";
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
    @IsString()
    @ApiProperty()
    content: String;
}
