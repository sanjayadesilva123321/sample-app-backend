import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform, Type} from "class-transformer";
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    roleId: number;
}
