import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, Res, forwardRef } from '@nestjs/common';
import { CreatePlanearDto } from './dto/create-planear.dto';
import { UpdatePlanearDto } from './dto/update-planear.dto';
import { Responsible } from './entities/responsible.entity';
import { Document } from './entities/document.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { codeErrors } from 'src/params';
import { User } from 'src/auth/entities/user.entity';
import { UploadDocumentDto } from './dto/upload-document.dto';
import * as path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import * as fs from 'fs-extra';
import { RequiredResponsibleDocuments, RequiredResponsibleDocumentsMain } from './interfaces/documents.interface';
import { DocumentsResponsible } from 'src/report/entities/documentsResponsible.entity';
import { ResponsibleAssignments } from './interfaces/responsibleAssignments.interface';
import { Company } from 'src/configuration/entities/company.entity';

@Injectable()
export class PlanearService {
  constructor(
    @InjectModel(Responsible.name) private responsibleModel: Model<Responsible>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
    @InjectModel(DocumentsResponsible.name) private documentsResponsible: Model<DocumentsResponsible>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService, // Inyecta RoleService
  ) {}

  async getAllResponsibles(): Promise<Responsible[]>{
    try {
      const responsibles = await this.responsibleModel.find().exec();
      return responsibles;
    } catch (error) {
        throw new Error('Error al realizar la petición: ' + error.message);
    }
  }

  async createResponsible(createResponsibleDto: CreateResponsibleDto, user: User): Promise<Responsible> {
    try {
      console.log(createResponsibleDto, user)

      const newResponsible =  new this.responsibleModel({
        ...createResponsibleDto,
        responsibleCreateId: user._id, 
         
      });
  
      const newResponsibleObject = await newResponsible.save();

      // Convertir el nuevo usuario a un objeto JSON
      return newResponsibleObject.toJSON();

    }catch (err){
      if(err.code === codeErrors.duplicatedKey){
        throw new BadRequestException(` Documento ${createResponsibleDto.responsibleDocumentNumber} ya se encuentra registrado en el sistema`);
      }
      console.log(err.message);
      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', err);
    }
  }

  async deleteResponsible(ids: string[],  user: User): Promise<Responsible[]>{
    console.log('desde eliminar', ids);

    console.log(ids);  
    try {
      console.log('IDs recibidos:', ids);

      const deletedResponsibles = [];

      for (const id of ids) {
        const result = await this.responsibleModel.findByIdAndDelete(id);
        if (!result) {
          throw new NotFoundException(`Responsable no encontrado ${id}`);
        }

        const documentsDeleted = await this.documentModel.find({
          documentNumber : result.responsibleDocumentNumber
        }).exec();

        console.log('documentos', documentsDeleted);
        const documents: any = [];
        documentsDeleted.forEach(document =>{
          const value = this.deleteResponsibleDocument(document._id, user)
          documents.push(value);
        })

        deletedResponsibles.push(result);
      }

      return deletedResponsibles;

      
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Si es NotFoundException, vuelve a lanzarla
      }

      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', err);
    }
  }

  async uploadDocument(uploadDocumentDto: UploadDocumentDto, user: User, file: any): Promise<Document>{  
    try {
    
      uploadDocumentDto.documentType = Number(uploadDocumentDto.documentType);
  
      const documentType = [
        {
          documentType: 1,
          documentName: 'Licensia SST',
          required: true,
        },
        {
          documentType: 2,
          documentName: 'Curso 20/50 Horas',
          required: true,
        },
        {
          documentType: 3,
          documentName: 'Hoja de Vida',
          required: true,
        },
        {
          documentType: 999,
          documentName: 'Anexos',
          required: false,
        }
      ];

      const isValidDocumentType = documentType.some(
      (doc) => doc.documentType === uploadDocumentDto.documentType
      );

      if (!isValidDocumentType) {
        throw new BadRequestException('Tipo de archivo invalido');
      }

      //Valida que exista reesponsable
      const responsible = await this.responsibleModel.findOne({_id: uploadDocumentDto.responsibleId}).exec();

      if (!responsible) {
        throw new BadRequestException('Responsable no existe en base de datos');
      }

  
      // Verifica si ya existe un documento del mismo tipo para el responsable
      const existingDocument = await this.documentModel.findOne({
        documentNumber: responsible.responsibleDocumentNumber,
        documentType: uploadDocumentDto.documentType
      }).exec();



      if (existingDocument) {

        // Eliminar el archivo físico existente
        const existingDocumentPath = path.resolve(__dirname, `../../${existingDocument.documentPath}/${existingDocument.documentNamePath}`);
        if (fs.existsSync(existingDocumentPath)) {
          fs.unlinkSync(existingDocumentPath);
        }

        // Eliminar el registro de la base de datos
        const resultado = await this.documentModel.deleteOne({
          documentNumber: existingDocument.documentNumber,
          documentType: existingDocument.documentType
        });

      }

      // Generar la ruta del directorio basado en el número de documento del cliente
      const date = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
      const fileExtension = this.getFileExtensionFromMimeType(file.mimetype);
      const relativePath = `src/assets/storage/documents/requierements/${responsible.responsibleDocumentNumber}`
      const documentFolder = path.resolve(__dirname, `../../${relativePath}`);
      const documentFilename = `${date}-${uploadDocumentDto.documentType}-${responsible.responsibleDocumentNumber}.pdf`; // Suponiendo que sea un archivo PDF
      const documentPath = path.join(documentFolder, documentFilename);

      const newDocument =  new this.documentModel({
        documentNumber:   responsible.responsibleDocumentNumber,
        documentType:     uploadDocumentDto.documentType,
        documentName:     file.originalname.split('.')[0],
        documentNamePath: documentFilename,
        documentPath:     relativePath,
        documentSize:     `${file.size} bytes`,
        documentExtention: fileExtension,
        documentCreateId: user._id, 
      });

      if (!newDocument){
        throw new BadRequestException('Hubo un error al crear el documento');
      }

      await newDocument.save();

      // Crear directorio si no existe
      await fs.ensureDir(documentFolder);

      // Guardar el archivo en disco
      fs.writeFileSync(documentPath, file.buffer); // Aquí usamos writeFileSync

      const documents = await this.documentModel.find({ documentNumber: responsible.responsibleDocumentNumber }).exec();
  
      // Determinar si todos los documentos requeridos han sido cargados
      const allRequiredDocumentsUploaded = documentType
        .filter(docType => docType.required) // Filtrar solo los documentos requeridos
        .every(docType => 
          documents.some(doc => doc.documentType === docType.documentType) // Verificar si el documento está cargado
        );
  
      const flgDocumentation: boolean = allRequiredDocumentsUploaded ? true : false;
      
      if (flgDocumentation){
        if (responsible.responsibleStatus != 'Activo'){

          // Actualizar el estado directamente
          const updatedResponsible = await this.responsibleModel.findByIdAndUpdate(
            uploadDocumentDto.responsibleId,            // ID del documento que deseas actualizar
            { responsibleStatus: 'Activo' },            // Objeto con los campos a actualizar
          );
  
        }
      }
      
      return newDocument;

    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Si es NotFoundException, vuelve a lanzarla
      }

      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', err);
    }
  }

  async uploadMassiveDocument(uploadDocumentDto: UploadDocumentDto[], user: User, file: any[]): Promise<Document[]>{  
    try {

      const documentType = [
        {
          documentType: 1,
          documentName: 'Licensia SST',
          required: true,
        },
        {
          documentType: 2,
          documentName: 'Curso 20/50 Horas',
          required: true,
        },
        {
          documentType: 3,
          documentName: 'Hoja de Vida',
          required: true,
        },
        {
          documentType: 999,
          documentName: 'Anexos',
          required: false,
        }
      ];

      const documentsRepsonse: Document[] = [];
    
      for (let i = 0; i < uploadDocumentDto.length; i++){
        uploadDocumentDto[i].documentType = Number(uploadDocumentDto[i].documentType);
  
      

        const isValidDocumentType = documentType.some(
        (doc) => doc.documentType === uploadDocumentDto[i].documentType
        );

        if (!isValidDocumentType) {
          throw new BadRequestException('Tipo de archivo invalido');
        }

        //Valida que exista reesponsable
        const responsible = await this.responsibleModel.findOne({_id: uploadDocumentDto[i].responsibleId}).exec();

        if (!responsible) {
          throw new BadRequestException('Responsable no existe en base de datos');
        }

    
        // Verifica si ya existe un documento del mismo tipo para el responsable
        const existingDocument = await this.documentModel.findOne({
          documentNumber: responsible.responsibleDocumentNumber,
          documentType: uploadDocumentDto[i].documentType
        }).exec();



        if (existingDocument) {

          // Eliminar el archivo físico existente
          const existingDocumentPath = path.resolve(__dirname, `../../${existingDocument.documentPath}/${existingDocument.documentNamePath}`);
          if (fs.existsSync(existingDocumentPath)) {
            fs.unlinkSync(existingDocumentPath);
          }

          // Eliminar el registro de la base de datos
          const resultado = await this.documentModel.deleteOne({
            documentNumber: existingDocument.documentNumber,
            documentType: existingDocument.documentType
          });

        }

        // Generar la ruta del directorio basado en el número de documento del cliente
        const date = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
        const fileExtension = this.getFileExtensionFromMimeType(file[i].mimetype);
        const relativePath = `src/assets/storage/documents/requierements/${responsible.responsibleDocumentNumber}`
        const documentFolder = path.resolve(__dirname, `../../${relativePath}`);
        const documentFilename = `${date}-${uploadDocumentDto[i].documentType}-${responsible.responsibleDocumentNumber}.pdf`; // Suponiendo que sea un archivo PDF
        const documentPath = path.join(documentFolder, documentFilename);

        const newDocument =  new this.documentModel({
          documentNumber:   responsible.responsibleDocumentNumber,
          documentType:     uploadDocumentDto[i].documentType,
          documentName:     file[i].originalname.split('.')[0],
          documentNamePath: documentFilename,
          documentPath:     relativePath,
          documentSize:     `${file[i].size} bytes`,
          documentExtention: fileExtension,
          documentCreateId: user._id, 
        });

        if (!newDocument){
          throw new BadRequestException('Hubo un error al crear el documento');
        }

        await newDocument.save();

        // Crear directorio si no existe
        await fs.ensureDir(documentFolder);

        // Guardar el archivo en disco
        fs.writeFileSync(documentPath, file[i].buffer); // Aquí usamos writeFileSync

        const documents = await this.documentModel.find({ documentNumber: responsible.responsibleDocumentNumber }).exec();
    
        // Determinar si todos los documentos requeridos han sido cargados
        const allRequiredDocumentsUploaded = documentType
          .filter(docType => docType.required) // Filtrar solo los documentos requeridos
          .every(docType => 
            documents.some(doc => doc.documentType === docType.documentType) // Verificar si el documento está cargado
          );
    
        const flgDocumentation: boolean = allRequiredDocumentsUploaded ? true : false;
        
        if (flgDocumentation){
          if (responsible.responsibleStatus != 'Activo'){

            // Actualizar el estado directamente
            const updatedResponsible = await this.responsibleModel.findByIdAndUpdate(
              uploadDocumentDto[i].responsibleId,            // ID del documento que deseas actualizar
              { responsibleStatus: 'Activo' },            // Objeto con los campos a actualizar
            );
    
          }
        }

        documentsRepsonse.push(newDocument);
      }
      console.log(documentsRepsonse);
      return documentsRepsonse;

    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Si es NotFoundException, vuelve a lanzarla
      }

      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', err);
    }
  }

  private getFileExtensionFromMimeType(mimeType: string): string {
    const mimeTypes = {
      'application/pdf': 'pdf',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      // Add more MIME types and their extensions as needed
    };

    return mimeTypes[mimeType] || 'bin';
  }

  async getAllDocument(documentNumberResponsible: number, user: User): Promise<RequiredResponsibleDocumentsMain> {
    console.log(documentNumberResponsible);
    try {
      const documents = await this.documentModel.find({ documentNumber: documentNumberResponsible }).exec();
  
      const documentType = [
        {
          documentType: 1,
          documentName: 'Licensia SST',
          required: true,
        },
        {
          documentType: 2,
          documentName: 'Curso 20/50 Horas',
          required: true,
        },
        {
          documentType: 3,
          documentName: 'Hoja de Vida',
          required: true,
        },
        {
          documentType: 999,
          documentName: 'Anexos',
          required: false,
        }
      ];
  
      const statusDocumentationTrue = 'Documentacion Verificada';
      const statusDocumentationFalse = 'Documentacion Pendiente';
  
      // Determinar si todos los documentos requeridos han sido cargados
      const allRequiredDocumentsUploaded = documentType
        .filter(docType => docType.required) // Filtrar solo los documentos requeridos
        .every(docType => 
          documents.some(doc => doc.documentType === docType.documentType) // Verificar si el documento está cargado
        );
  
      const statusDocumentation = allRequiredDocumentsUploaded ? statusDocumentationTrue : statusDocumentationFalse;
  
      const requiredResponsibleDocuments: RequiredResponsibleDocuments[] = documentType.map(docType => {
        const matchingDocuments = documents.filter(doc => doc.documentType === docType.documentType);
  
        return {
          title: docType.documentName,
          type: docType.documentType,
          required: docType.required,
          status: matchingDocuments.length > 0,
          disabled: matchingDocuments.length > 0,
          uploadFile: false,
          documents: matchingDocuments.map(doc => ({
            _id: doc._id,
            documentNumber: doc.documentNumber,
            documentType: doc.documentType,
            documentName: doc.documentName,
            documentNamePath: doc.documentNamePath,
            documentPath: doc.documentPath,
            documentSize: doc.documentSize,
            documentExtention: doc.documentExtention,
            documentCreateId: doc.documentCreateId,
            documentUpdateDate: doc.documentUpdateDate,
            documentUpdateHour: doc.documentUpdateHour,
            documentCreateDate: doc.documentCreateDate,
            documentCreateHour: doc.documentCreateHour
          }))
        };
      });
  
      if (!documents) {
        throw new NotFoundException(`No hay documentos registrados para el responsable ${documentNumberResponsible}`);
      }
  
      // Retornar el objeto con la estructura requerida
      const result: RequiredResponsibleDocumentsMain = {
        statusDocumentation: statusDocumentation, // Estado general de la documentación
        RequiredResponsibleDocuments: requiredResponsibleDocuments // Array de documentos requeridos
      };
  
      return result;
  
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
  
      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', error);
    }
  }

  async deleteResponsibleDocument(documentId: string, user: User): Promise<Document>{  
    try {
      const documents = await this.documentModel.findOneAndDelete({ _id: documentId}).exec();

      if (!documents) {
        throw new BadRequestException('Documento no se pudo eliminar correctamente');
      }

      // Eliminar el archivo físico existente
      const existingDocumentPath = path.resolve(__dirname, `../../${documents.documentPath}/${documents.documentNamePath}`);
      if (fs.existsSync(existingDocumentPath)) {
        fs.unlinkSync(existingDocumentPath);
      }

      return documents;

    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Si es NotFoundException, vuelve a lanzarla
      }

      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', err);
    }
  }
 
  async getAllResponsiblesAssignments(): Promise<ResponsibleAssignments[]>{
    try {
      const responsiblesAssignments = await this.documentsResponsible.find().exec();
      if (responsiblesAssignments) {
        // Crea un array de promesas para obtener Responsible y Company en paralelo
        const assignmentsWithDetails = await Promise.all(responsiblesAssignments.map(async (assignment) => {
            const [responsible, company] = await Promise.all([
              this.responsibleModel.findById(assignment.documentsResponsibleId).exec(),
              this.companyModel.findById(assignment.documentsResponsibleCompanyId).exec()
            ]);

            return {
              _id: assignment._id,
              documentsResponsibleId: assignment.documentsResponsibleId,
              documentsResponsibleName: responsible.responsibleName,
              documentsResponsibleCompanyId: assignment.documentsResponsibleCompanyId,
              documentsResponsibleCompanyName: company.companyName,
              documentsResponsibleNamePath: assignment.documentsResponsibleNamePath,
              documentsResponsiblePath: assignment.documentsResponsiblePath,
              documentsResponsibleSize: assignment.documentsResponsibleSize,
              documentsResponsibleExtention: assignment.documentsResponsibleExtention,
              documentsResponsibleCreateId: assignment.documentsResponsibleCreateId,
              documentsResponsibleUpdateDate: assignment.documentsResponsibleUpdateDate,
              documentsResponsibleUpdateHour: assignment.documentsResponsibleUpdateHour,
              documentsResponsibleCreateDate: assignment.documentsResponsibleCreateDate,
              documentsResponsibleCreateHour: assignment.documentsResponsibleCreateHour
            };
        }));

        return assignmentsWithDetails;
      }
      
    } catch (error) {
        throw new Error('Error al realizar la petición: ' + error.message);
    }
  }

}
