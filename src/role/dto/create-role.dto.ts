import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class CreateRoleDto {
    
    @IsString()
    roleName: string;

    @IsArray()
    @ArrayNotEmpty()
    roleModules: string[];
}
