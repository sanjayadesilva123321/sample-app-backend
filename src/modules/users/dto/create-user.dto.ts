import {
    IsDefined,
    IsNotEmpty,
    IsEmail,
    IsAlphanumeric,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

/**
 * Define create user request body
 * @param  email
 * @param  password
 * @returns object
 */
export class CreateUserDto {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsAlphanumeric()
    @ApiProperty()
    password: string;
}
