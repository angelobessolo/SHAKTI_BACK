import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Company {
    _id?: string; //Id company

    @Prop({required: true})
    companyName: string; //Type document responsible

    @Prop({required: true})
    companyDocumentType: string; //Type company
    
    @Prop({unique: true, required: true})
    companyDocumentNumber: number; //Document number responsible

    @Prop({required: true})
    companyCity: string; //Expedition date responsible

    @Prop({required: true})
    companyAddress: string; //Name responsible

    @Prop({required: true})
    companyPhoneNumber: number; //License number responsible

    @Prop({required: true})
    companyEmail: string; //License expire date responsible

    @Prop({required: true})
    companyIndustry: string; //Assign date responsible

    @Prop({required: true})
    companyWebsite: string; //Document number company responsible

    @Prop({required: true})
    companyRepresentativeName: string; //Companny name responsible

    @Prop({required: true})
    companyRepresentativeTypeDocument: string; // Usuario de creacion del modulo 

    @Prop({required: true})
    companyRepresentativeDocumentNumber: number; // Usuario de creacion del modulo 

    @Prop({required: true})
    companyRepresentativeEmail: string; // Usuario de creacion del modulo 

    @Prop({required: true})
    companyRepresentativePhoneNumber: number; // Usuario de creacion del modulo 

    @Prop({ default: () => formatDateToMMDDYYYY(new Date()) }) // Convert date to MM/DD/YYYY format
    companyCreateDate: string; 

    @Prop({ default: () => formatTime(new Date()) }) // Convert time to HH:MM format
    companyCreateHour: string;

    @Prop({ default: '' }) // Convert date to MM/DD/YYYY format
    companyUpdateDate: string; 

    @Prop({ default: '' }) // Convert time to HH:MM format
    companyUpdateHour: string;


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

export const CompanySchema = SchemaFactory.createForClass(Company);