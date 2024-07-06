import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User } from 'src/auth/entities/user.entity';
import { codeErrors } from 'src/params';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './entities/role.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RoleService {
  public codeErrors = codeErrors;
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService, // Inyecta RoleService
  ) {}

  async create(createRoleDto: CreateRoleDto, user: User) {
    try {
      const newRole =  new this.roleModel({
        ...createRoleDto,
        roleUserCreateId: user._id, // Asigna el ID del usuario al campo userCreated del módulo  
      });
  
      const roleObject = await newRole.save();
      
      // Convertir el nuevo usuario a un objeto JSON
  
      return roleObject.toJSON();
  
     } catch (err) {  
      if(err.code === codeErrors.duplicatedKey){
        throw new BadRequestException(`Modulo ${createRoleDto.roleName} ya se encuentra registrado en el sistema`);
      }
      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!');
     }
  }

  async findRoleByName(role: string): Promise<Role>{
    try {
      const roleName = await this.roleModel.findOne({roleName: role});
      console.log(roleName);
      if (!roleName){
        throw new NotFoundException('¡No se encontró coincidencia con el registro en la base de datos!');
      }
      return roleName;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Si es NotFoundException, vuelve a lanzarla
      }
      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
