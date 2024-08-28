import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFOptionList, PDFRadioGroup, StandardFonts } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import * as fs from 'fs-extra';
import { DocumentsResponsible } from './entities/documentsResponsible.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';



@Injectable()
export class ReportService {
  constructor(
    @InjectModel(DocumentsResponsible.name) private documentsResponsibleModel: Model<DocumentsResponsible>
  ){}

  async generateResponsibleDocument(values: any, user: User): Promise<any> {
    try {
      const inputPath = path.resolve(__dirname, '../../src/assets/templates/responsible/FT-SST-V2.1.pdf');
      console.log(values);
      // Generar la ruta del directorio basado en el número de documento del cliente
      const date = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
      const relativePath = `src/assets/storage/documents/responsible/${values.assignedCompanyDocumentNumberField}`
      const documentFolder = path.resolve(__dirname, `../../${relativePath}`);
      const documentFilename = `${date}-${values.legalRepresentativeNameField1}-${values.assignedCompanyDocumentNumberField}.pdf`; // Suponiendo que sea un archivo PDF
      const documentPath = path.join(documentFolder, documentFilename);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString().split('/');
      const newDate = this.formatDate(formattedDate, 'DD/MM/YYYY'); 

      const variables = {
        dayField1: newDate[0],
        monthField1: newDate[1],
        yearField1: newDate[2],
        legalRepresentativeNameField1: values.legalRepresentativeNameField1,
        documentNumberField: values.documentNumberField,
        assignedCompanyNameField1: values.assignedCompanyNameField,
        assignedCompanyDocumentNumberField: String(values.assignedCompanyDocumentNumberField),
        assignedCompanyExpeditionCityField: values.assignedCompanyExpeditionCityField,
        assignedCompanyLicenseNumberField: String(values.assignedCompanyLicenseNumberField),
        assignedCompanyLicenseDayField: values.assignedCompanyLicenseDayField,
        assignedCompanyLicenseMonthField: values.assignedCompanyLicenseMonthField,
        assignedCompanyLicenseYearField: values.assignedCompanyLicenseYearField,
        dayField2: newDate[0],
        monthField2: newDate[1],
        yearField2: newDate[2],
        legalRepresentativeNameField2: values.companyRepresentativeName,
        assignedCompanyNameField2: values.assignedCompanyNameField,
      };

      // Leer el PDF
      const pdfBytes = readFileSync(inputPath);

      // Cargar el PDF en pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Obtener los formularios
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      // Imprimir detalles de los campos
      fields.forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();

      });

      // Asignar valores a los campos
      fields.forEach(field => {
        const name = field.getName();
        const value = variables[name];

        if (value !== undefined) {
          if (field instanceof PDFTextField) {
            field.setText(value);
          } else if (field instanceof PDFCheckBox) {
            if (value === 'true') {
              field.check();
            } else {
              field.uncheck();
            }
          } else if (field instanceof PDFDropdown || field instanceof PDFOptionList || field instanceof PDFRadioGroup) {
            field.select(value);
          }
        }
      });

      // Guardar el PDF modificado
      const modifiedPdfBytes = await pdfDoc.save();

      // Crear directorio si no existe
      await fs.ensureDir(documentFolder);

      // guarda directorio si no existe
      fs.writeFileSync(documentPath, modifiedPdfBytes);

      // Obtener el tamaño del archivo en bytes
      const stats = fs.statSync(documentPath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2) + ' KB';

      // Obtener la extensión del archivo
      const fileExtension = path.extname(documentPath).slice(1); // `slice(1)` para eliminar el punto (.)


      if(fs.existsSync(documentPath)){
        const findPathName = await this.documentsResponsibleModel.findOne({
          documentsResponsibleId: values.responsibleId,
          documentsResponsibleNamePath: documentFilename,
        }).exec();

        if (findPathName){
          findPathName.documentsResponsibleSize = fileSizeInKB;
          findPathName.documentsResponsibleExtention = fileExtension;
          findPathName.documentsResponsibleUpdateDate = new Date().toLocaleDateString();  // Ajusta según tu formato
          findPathName.documentsResponsibleUpdateHour = new Date().toTimeString().substring(0, 8);   // Ajusta según tu formato
          const modelUpdated = await findPathName.save();
          
        }else{
          const newDocumentsResponsibleModel =  new this.documentsResponsibleModel({

            documentsResponsibleId: values.responsibleId,
            documentsResponsibleCompanyId: values.companyId,
            documentsResponsibleNamePath: documentFilename,
            documentsResponsiblePath: relativePath,
            documentsResponsibleSize: fileSizeInKB,
            documentsResponsibleExtention: fileExtension,
            documentsResponsibleCreateId: user._id,    
          });

          const newDocumentsResponsibleModelObject = await newDocumentsResponsibleModel.save(); 
          console.log('llega', newDocumentsResponsibleModelObject);
        }
        
        
      }

      // Convertir el PDF a Base64
      const pdfBase64 = Buffer.from(modifiedPdfBytes).toString('base64');
      
      const reponse = {
        message: 'Documento creado correctamente y almacenado en la ruta adjunta',
        path: relativePath,
        documentName: documentFilename,
        document: pdfBase64
      }

      return reponse;

    } catch (error) {
      throw new Error('Error procesando PDF');
    }
  }

  formatDate(date, format): string[] {
    switch(format) {
      case 'DD/MM/YYYY':
        // const newDate: string = date[1] + date[0] + date[2];
        const newDate = [];
        newDate.push(date[1]);
        newDate.push(date[0]);
        newDate.push(date[2]);
        return newDate;          
      break;
    }
  }
  

}
