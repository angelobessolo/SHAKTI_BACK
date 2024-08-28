import { Controller, Get, Post,Request, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import {Response} from 'express';
import { PlanearService } from './planear.service';
import { CreatePlanearDto } from './dto/create-planear.dto';
import { UpdatePlanearDto } from './dto/update-planear.dto';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('planear')
export class PlanearController {
  constructor(private readonly planearService: PlanearService) {}
  // Requests asociados con responsables

  // Obtenerresponsable(s)
  @UseGuards( AuthGuard )
  @Get('/recursos/responsable')
  async getAllResponsibles(@Res() res: Response) {
    try {
      const responsibles = await this.planearService.getAllResponsibles();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Peticioón realizada con exito',
        data: {
          responsibles: responsibles,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de retornar la busqueda',
        error: error.message,
      });
    }
  }
  
  // Crear responsable
  @UseGuards( AuthGuard )
  @Post('/recursos/responsable')
  async createResponsible(@Request() req: Request, @Res() res: Response, @Body() createResponsibleDto: CreateResponsibleDto) {
    try {
      const user = req['user'];
      const responsible = await this.planearService.createResponsible(createResponsibleDto, user);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Responsable creado con exito',
        data: {
          responsible: responsible,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de la creacion del responsable',
        error: error.message,
      });
    }
  }

  // Eliminar responsable(s)
  @UseGuards( AuthGuard )
  @Delete('/recursos/responsable')
  async deleteResponsible(@Request() req: Request, @Res() res: Response , @Body() ids: string[]) {
    console.log('array', ids.length);
   
    try {
      const user = req['user'];
      const responsible = await this.planearService.deleteResponsible(ids, user);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Responsable eliminado con exito',
        data: {
          responsible: responsible,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de eliminar registro',
        error: error.message,
      });
    }
  }

  // Cargue de documentos 
  @UseGuards( AuthGuard )
  @Post('/recursos/responsable/documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@Request() req: Request, @Res() res: Response, @Body() uploadDocumentDto: any, @UploadedFile() file: Express.Multer.File) {
    console.log(uploadDocumentDto, file, );
    try {
      const user = req['user'];
      const document = await this.planearService.uploadDocument(uploadDocumentDto, user, file);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Documento ${document.documentName} cargado con exito`,
        data: {
          responsible: document,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de la cargar documentos del responsable',
        error: error.message,
      });
    }
  }

  // Cargue documentos
  @UseGuards( AuthGuard )
  @Post('/recursos/responsable/documents/uploadMassive')
  @UseInterceptors(FileInterceptor('files'))
  async uploadMassiveDocument(@Request() req: Request, @Res() res: Response, @Body() uploadDocumentDto: any[], @UploadedFile() file: Express.Multer.File[]) {
    console.log(uploadDocumentDto, file, );
    try {
      const user = req['user'];
      const document = await this.planearService.uploadMassiveDocument(uploadDocumentDto, user, file);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Documento cargado con exito`,
        data: {
          responsible: document,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de la cargar documento del responsable',
        error: error.message,
      });
    }
  }

  // Obtener documentos requeridos responsable
  @UseGuards( AuthGuard )
  @Post('/recursos/responsable/get-documents')
  async getAllDocument(@Request() req: Request, @Res() res: Response, @Body('documentNumberResponsible') documentNumberResponsible: number) {
    try {
      const user = req['user'];
      const documents = await this.planearService.getAllDocument(documentNumberResponsible, user);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Consulta realizada con exito',
        data: {
          documents: documents,
        }
      });
      
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de realizar la consulta',
        error: error,
      });
    }
  }
  
  // Eliminar documentos requeridos reponsbale
  @UseGuards( AuthGuard)
  @Delete('/recursos/responsable/documents/deleteById')
  async deleteResponsibleDocument(@Request() req: Request, @Res() res: Response, @Query('documentId') documentId: string) {
    console.log(documentId);
    try {
      const user = req['user'];
      const documents = await this.planearService.deleteResponsibleDocument(documentId, user);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Documento eliminado correctamente',
        data: {
          documents: documents,
        }
      });
      
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de realizar la petición',
        error: error,
      });
    }
  }

  // Obtener asignaciones responsable(s)
  @UseGuards( AuthGuard )
  @Get('/recursos/asignaciones-responsable')
  async getAllResponsiblesAssignments(@Res() res: Response) {
    try {
      const assignments = await this.planearService.getAllResponsiblesAssignments();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Peticioón realizada con exito',
        data: {
          responsibles: assignments,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de retornar asignaciones de responsables',
        error: error.message,
      });
    }
  }

}
