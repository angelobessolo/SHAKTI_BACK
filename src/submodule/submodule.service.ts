import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubmoduleDto } from './dto/create-submodule.dto';
import { UpdateSubmoduleDto } from './dto/update-submodule.dto';
import { codeErrors } from 'src/params';
import { InjectModel } from '@nestjs/mongoose';
import { Submodule } from './entities/submodule.entity';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SubmoduleService {
  public codeErrors = codeErrors;
  constructor(
    @InjectModel(Submodule.name) 
    private submoduleModel: Model<Submodule>,

  ) {}

  async create(createSubmoduleDto: CreateSubmoduleDto, user: User) {
    try {
      const newSubmodule =  new this.submoduleModel({
        ...createSubmoduleDto,
        submoduleUserCreateId: user._id, // Asigna el ID del usuario al campo userCreated del módulo  
      });
  
      const submoduleObject = await newSubmodule.save();
      
      // Convertir el nuevo usuario a un objeto JSON
  
      return submoduleObject.toJSON();
  
     } catch (err) {
      if(err.code === codeErrors.duplicatedKey){
        throw new BadRequestException(`Submodulo ${createSubmoduleDto.submoduleName} ya existe`);
      }
      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!');
     }
  }

  async findSubmoduleByName(submoduleName: string): Promise<Submodule>{
    const submoduleModel = await this.submoduleModel.findOne({submoduleName: submoduleName});

    if (!submoduleModel){
      throw new NotFoundException(`¡No se encontró coincidencia con el registro en la base de datos! ${submoduleName}`);
    }

    return submoduleModel
  }

  findAll() {
    return `This action returns all submodule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} submodule`;
  }

  update(id: number, updateSubmoduleDto: UpdateSubmoduleDto) {
    return `This action updates a #${id} submodule`;
  }

  remove(id: number) {
    return `This action removes a #${id} submodule`;
  }
}
