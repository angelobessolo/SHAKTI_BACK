import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/entities/user.entity';
import { codeErrors } from 'src/params';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService, // Inyecta RoleService
  ) {}
  async getAllCompanies(): Promise<Company[]>{
    try {
      const companies = await this.companyModel.find().exec();
      return companies;
    } catch (error) {
        throw new Error('Error al realizar la petición: ' + error.message);
    }
  }

  async createCompany(createCompanyDto: CreateCompanyDto, user: User): Promise<Company> {
    try {
      console.log(createCompanyDto, user)

      const newCompany =  new this.companyModel({
        ...createCompanyDto,
        responsibleCreateId: user._id, 
         
      });
  
      const newCompanyObject = await newCompany.save();

      // Convertir el nuevo usuario a un objeto JSON
      return newCompanyObject.toJSON();

    }catch (err){
      if(err.code === codeErrors.duplicatedKey){
        throw new BadRequestException(` Documento de empresa ${createCompanyDto.companyDocumentNumber} ya se encuentra registrado en el sistema`);
      }
      console.log(err.message);
      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', err);
    }
  }

  async deleteCompany(ids: string[],  user: User): Promise<Company[]>{
    try {

      const deletedCompanies = [];

      for (const id of ids) {
        const result: Company= await this.companyModel.findByIdAndDelete(id);
        if (!result) {
          throw new NotFoundException(`Empresa no encontrada ${id}`);
        }

        const companiesDeleted = await this.companyModel.find({
          companyDocumentNumber : result.companyDocumentNumber
        }).exec();
      }

      return deletedCompanies;

      
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Si es NotFoundException, vuelve a lanzarla
      }

      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!', err);
    }
  }
}
