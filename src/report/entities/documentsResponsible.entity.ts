import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class DocumentsResponsible {
    _id?: string; //Id document
    
    @Prop({required: true})
    documentsResponsibleId: string; //Document number responsible

    @Prop({required: true})
    documentsResponsibleCompanyId: string; //Document number responsible

    @Prop({required: true, unique: true})
    documentsResponsibleNamePath: string; //Document path

    @Prop({required: true})
    documentsResponsiblePath: string; //Document path

    @Prop({required: true})
    documentsResponsibleSize: string; //Document size

    @Prop({required: true})
    documentsResponsibleExtention: string; //Document extention

    @Prop({required: true})
    documentsResponsibleCreateId: string; // Usuario de creacion del documento 

    @Prop({ default: () => formatDateToMMDDYYYY(new Date()) }) // Convert date to MM/DD/YYYY format
    documentsResponsibleCreateDate: string; 

    @Prop({ default: () => formatTime(new Date()) }) // Convert time to HH:MM format
    documentsResponsibleCreateHour: string;

    @Prop({ default: '' }) // Convert date to MM/DD/YYYY format
    documentsResponsibleUpdateDate: string; 

    @Prop({ default: '' }) // Convert time to HH:MM format
    documentsResponsibleUpdateHour: string;

}

function formatDateToMMDDYYYY(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function formatTime(date: Date): string {
    return date.toTimeString().substring(0, 8);
}

export const DocumentsResponsibleSchema = SchemaFactory.createForClass(DocumentsResponsible);
