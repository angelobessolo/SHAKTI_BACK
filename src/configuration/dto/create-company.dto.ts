import { IsNumber, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    companyName: string;

    @IsString()
    companyDocumentType: string;

    @IsNumber()
    companyDocumentNumber: number;

    @IsString()
    companyCity: string;

    @IsString()
    companyAddress: string;

    @IsNumber()
    companyPhoneNumber: number;

    @IsString()
    companyEmail: string;

    @IsString()
    companyIndustry: string;

    @IsString()
    companyWebsite: string;

    @IsString()
    companyRepresentativeName: string;

    @IsString()
    companyRepresentativeTypeDocument: string;

    @IsNumber()
    companyRepresentativeDocumentNumber: number;

    @IsString()
    companyRepresentativeEmail: string;

    @IsNumber()
    companyRepresentativePhoneNumber: number;
}
