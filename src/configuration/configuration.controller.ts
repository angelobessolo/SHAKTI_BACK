import { Controller, Get, Post, Request, Body, Patch, Param, Delete, UseGuards, HttpStatus, Res } from '@nestjs/common';
import {Response} from 'express';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { AuthGuard } from 'src/auth/guards/Auth.guard';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  // Requests asociados con responsables

  @UseGuards( AuthGuard )
  @Get('/getAllCompanies')
  async getAllCompanies(@Res() res: Response) {
    try {
      const companies = await this.configurationService.getAllCompanies();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Peticioón realizada con exito',
        data: {
          companies: companies,
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
  
  @UseGuards( AuthGuard )
  @Post('/createCompany')
  async createCompany(@Request() req: Request, @Res() res: Response, @Body() createCompanyDto: CreateCompanyDto) {
    try {
      const user = req['user'];
      const company = await this.configurationService.createCompany(createCompanyDto, user);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Empresa creada con exito',
        data: {
          company: company,
        }
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al momento de crear la empresa',
        error: error.message,
      });
    }
  }

  @UseGuards( AuthGuard )
  @Delete('/DeleteCompany')
  async deleteCompany(@Request() req: Request, @Res() res: Response , @Body() ids: string[]) {
    console.log('array', ids.length);
   
    try {
      const user = req['user'];
      const company = await this.configurationService.deleteCompany(ids, user);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Empresa eliminada con exito',
        data: {
          company: company,
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

}
