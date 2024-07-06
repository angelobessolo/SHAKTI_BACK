import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateSubmoduleDto {
    @IsString()
    submoduleName: string;

    @IsOptional()
    @IsString()
    submoduleIcon?: string;

    @IsOptional()
    @IsString()
    submoduleRoute?: string;

    @IsOptional()
    @IsString()
    submoduleDescription?: string;

    @IsOptional()
    @IsString()
    submodulePermissions?: string;

    @IsOptional()
    @IsArray()
    submoduleItems?: string[];
}
