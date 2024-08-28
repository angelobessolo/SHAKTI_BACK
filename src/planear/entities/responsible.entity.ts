import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Responsible {
    _id?: string; //Id responsible
    
    @Prop({required: true})
    responsibleDocumentType: string; //Type document responsible
    
    @Prop({unique: true, required: true})
    responsibleDocumentNumber: number; //Document number responsible

    @Prop({required: true})
    responsibleExpeditionDate: string; //Expedition date responsible

    @Prop({required: true})
    responsibleName: string; //Name responsible

    @Prop({required: true})
    responsibleLicenseNumber: number; //License number responsible

    @Prop({required: true})
    responsibleLicenseExpireDate: string; //License expire date responsible

    @Prop({required: true})
    responsibleExpeditionCity: string; //Assign date responsible

    @Prop({default: 'Inactivo'})
    responsibleStatus: string; //Status responsible

    @Prop({required: true})
    responsibleCreateId: string; // Usuario de creacion del modulo 

    @Prop({ default: () => formatDateToMMDDYYYY(new Date()) }) // Convert date to MM/DD/YYYY format
    responsibleCreateDate: string; 

    @Prop({ default: () => formatTime(new Date()) }) // Convert time to HH:MM format
    responsibleCreateHour: string;

    @Prop({ default: '' }) // Convert date to MM/DD/YYYY format
    responsibleUpdateDate: string; 

    @Prop({ default: '' }) // Convert time to HH:MM format
    responsibleUpdateHour: string;


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

export const ResponsibleSchema = SchemaFactory.createForClass(Responsible);
