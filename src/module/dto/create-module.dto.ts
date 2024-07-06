import { ArrayNotEmpty, IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateModuleDto {
    @IsString()
    moduleName: string;

    @IsOptional()
    @IsString()
    moduleIcon?: string;

    @IsOptional()
    @IsString()
    moduleRoute?: string;

    @IsOptional()
    @IsString()
    moduleDescription?: string;

    @IsOptional()
    @IsString()
    modulePermissions?: string;


    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    moduleSubmodules?: string[];
}
