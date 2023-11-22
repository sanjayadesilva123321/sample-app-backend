import {
    IsAlphanumeric,
    IsDefined,
    IsNotEmpty,
    IsNumber, IsString,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePostDto{
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

export class UpdatePostParamsDto {
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number;
}