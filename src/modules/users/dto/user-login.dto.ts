import {
    IsDefined,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsArray,
    IsNumber,
    ValidateNested,
    IsEnum,
    Min,
    IsBoolean,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    Validate,
    registerDecorator,
    ValidationOptions,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform, Type} from "class-transformer";

/**
 * Define create data source request body
 * @param  sourceUUID
 * @param  sourceName
 * @returns object
 */
export class UserLoginDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;
}
