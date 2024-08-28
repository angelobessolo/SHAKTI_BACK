import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class Document {
    _id?: string; //Id responsible
    
    @Prop({required: true})
    documentNumber: number; //Document number responsible

    @Prop({required: true})
    documentType: number; //Document type 

    @Prop({required: true})
    documentName: string; //Document path

    @Prop({required: true})
    documentNamePath: string;

    @Prop({required: true})
    documentPath: string; //Document path

    @Prop({required: true})
    documentSize: string; //Document size

    @Prop({required: true})
    documentExtention:string;

    @Prop({required: true})
    documentCreateId: string; // Usuario de creacion del documento 

    @Prop({ default: () => formatDateToMMDDYYYY(new Date()) }) // Convert date to MM/DD/YYYY format
    documentCreateDate: string; 

    @Prop({ default: () => formatTime(new Date()) }) // Convert time to HH:MM format
    documentCreateHour: string;

    @Prop({ default: '' }) // Convert date to MM/DD/YYYY format
    documentUpdateDate: string; 

    @Prop({ default: '' }) // Convert time to HH:MM format
    documentUpdateHour: string;

}

function formatDateToMMDDYYYY(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
