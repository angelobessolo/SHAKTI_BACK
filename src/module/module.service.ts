import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { codeErrors } from 'src/params';
import { Role } from 'src/role/entities/role.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ModuleService {
  public codeErrors = codeErrors;
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<Module>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService, // Inyecta RoleService
  ) {}

  async create(createModuleDto: CreateModuleDto, user: User): Promise<Module> {

   try {
    const newModule =  new this.moduleModel({
      ...createModuleDto,
      moduleUserCreateId: user._id, // Asigna el ID del usuario al campo userCreated del módulo  
    });

    const moduleObject = await newModule.save();
    
    // Convertir el nuevo usuario a un objeto JSON

    return moduleObject.toJSON();

   } catch (err) {  
    if(err.code === codeErrors.duplicatedKey){
      throw new BadRequestException(`Modulo ${createModuleDto.moduleName} ya se encuentra registrado en el sistema`);
    }
    throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!');
   }
  }

  findAll() {
    const modules = this.moduleModel.find().exec(); 
    return modules
  }
  // findModuleByName(roleName) {
  //   const roleName = user.roles[0];
  //   const roles = this.roleModel.findAll({roleName}).lean().exec(); 
  // }

  async findModuleByName(moduleName: string): Promise<Module> {
    const modelModule = await this.moduleModel.findOne({moduleName: moduleName}).exec();

    if (!modelModule){
      throw new NotFoundException('¡No se encontró coincidencia con el registro en la base de datos!');
    }

    return modelModule

  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(id: number) {
    return `This action removes a #${id} module`;
  }
}
