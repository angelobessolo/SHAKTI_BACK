import { Document } from 'mongoose';

// Define una interfaz que extienda el tipo de documento Mongoose
export interface IResponsible extends Document {
    responsibleDocumentType: string;
    responsibleDocumentNumber: number;
    responsibleExpeditionDate: Date;
    responsibleName: string;
    responsibleLicenseNumber: number;
    responsibleLicenseExpireDate: Date;
    responsibleExpeditionCity: string;
    responsibleCreateId: string;
    responsibleCreateDate: Date;
    responsibleCreateHour: Date;
    responsibleUpdateDate: Date;
    responsibleUpdateHour: Date;

    // Propiedades virtuales
    responsibleExpeditionDateFormatted?: string;
    responsibleLicenseExpireDateFormatted?: string;
    responsibleAsignDateFormatted?: string;
    responsibleCreateDateFormatted?: string;
    responsibleCreateHourFormatted?: string;
    responsibleUpdateDateFormatted?: string;
    responsibleUpdateHourFormatted?: string;
}
