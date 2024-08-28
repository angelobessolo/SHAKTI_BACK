import { IsNumber, IsString } from "class-validator";

export class UploadDocumentDto {
    @IsString()
    responsibleId: string;

    @IsNumber()
    documentType: number;

}

