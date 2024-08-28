import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Request, HttpStatus, UseGuards } from '@nestjs/common';
import {Response} from 'express';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

import * as fs from 'fs-extra';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import path from 'path';
import { AuthGuard } from 'src/auth/guards/Auth.guard';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  
  @UseGuards( AuthGuard )
  @Post('/modify')
  async generateResponsibleDocument(@Request() req: Request, @Res() res: Response, @Body() values: any,){
    try {
      const user = req['user'];
      const document = await this.reportService.generateResponsibleDocument(values, user);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Documento generado correctamente',
        data: {
          responsibleDocument: document,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de la generacion del documento',
        error: error.message,
      });
    }
  }
}
