import { Transform } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class CreateResponsibleDto {
    
    @IsString()
    responsibleDocumentType: string;

    @IsNumber()
    responsibleDocumentNumber: number;

    @Transform(({ value }) => formatDate(value))
    @IsString()
    responsibleExpeditionDate: string; // MM/DD/YYYY format

    @IsString()
    responsibleName: string;

    @IsNumber()
    responsibleLicenseNumber: number;

    @Transform(({ value }) => formatDate(value))
    @IsString()
    responsibleLicenseExpireDate: string; // MM/DD/YYYY format

    @IsString()
    responsibleExpeditionCity: string;
}

function formatDate(value: Date): string {
    const date = new Date(value);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}
