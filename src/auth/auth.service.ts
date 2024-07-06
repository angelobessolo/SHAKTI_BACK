import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { codeErrors } from 'src/params';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse, SubmoduleResponse, UserParams } from './interfaces/login-response';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { ModuleService } from 'src/module/module.service';
import { Module } from 'src/module/entities/module.entity';
import { SubmoduleService } from 'src/submodule/submodule.service';
import { Submodule } from 'src/submodule/entities/submodule.entity';

@Injectable()
export class AuthService {
  public codeErrors = codeErrors;
  public userParams: UserParams[];

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => RoleService)) private roleService: RoleService, // Inyecta RoleService
    @Inject(forwardRef(() => ModuleService)) private moduleService: ModuleService, // Inyecta RoleService
    @Inject(forwardRef(() => SubmoduleService)) private submoduleService: SubmoduleService, // Inyecta RoleService
    private jwtService: JwtService,

  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Encrypt Password
    // 2. Save user 
    // 3. To Generate JWT


    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcrypt.hashSync( password, 10 ),
        ...userData
      });

      await newUser.save();

      // Convertir el nuevo usuario a un objeto JSON
      const userObject = newUser.toJSON();
      
      const  { password:_, ...rest } = newUser.toJSON() ? newUser.toJSON() : newUser;
      return rest;

    }catch (err){
      if(err.code === codeErrors.duplicatedKey){
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('¡Ha ocurrido un error en el servidor!');
    }
  }

  async signIn(loginDto: LoginDto): Promise<LoginResponse> {
    // 1. Validate user credentials
    // 2. Generate JWT token
    // 3. Return JWT token
    // 4. Consultar información del usuario y retornar al front para guardar en storage

    const { email, password } = loginDto;
     
    const user = await this.userModel.findOne({ email: email });

    if (!user){
      throw new UnauthorizedException('Credenciales invalidas - Usuario no fue encontrado');
    }

    if (!bcrypt.compareSync( password, user.password)){
      throw new UnauthorizedException('Credenciales invalidas - No conincide la contraseña');
    }

    const { password:_, ...restDataUser } = user.toJSON(); 

    const values = {
      id: user.id
    }

    // Obtener los roles del usuario
    const roles = await this.roleService.findRoleByName(user.roles[0]);

    if (!roles) {
      throw new NotFoundException('Rol no encontrado');
    }
    
    // Obtener los módulos y submódulos asociados al rol
    if (roles) {
      this.userParams = await Promise.all(
        roles.roleModules.map(async (roleModuleName) => {
          const module = await this.moduleService.findModuleByName(roleModuleName);
          if (module) {
            const submodules: SubmoduleResponse[] = await Promise.all(
              module.moduleSubmodules.map(async (submoduleName) => {
                console.log(module.moduleName);
                const submodule = await this.submoduleService.findSubmoduleByName(submoduleName);
                console.log(submodule.submoduleName);
                return {
                  submoduleName: submodule.submoduleName,
                  submoduleIcon: submodule.submoduleIcon,
                  submoduleDescription: submodule.submoduleDescription,
                  submoduleRoute: submodule.submoduleRoute,
                  submoduleItems: submodule.submoduleItems,
                };
              })
            );
            return {
              moduleName: module.moduleName,
              moduleIcon: module.moduleIcon,
              moduleDescription: module.moduleDescription,
              moduleRoute: module.moduleRoute,
              submodules: submodules,
            };
          }
          return null;
        })
      )

      console.log(roles);
      return {
        user: restDataUser,
        userParams: this.userParams,
        token: this.getJwtToken(values)
      };
    }
  }

  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll():Promise<User[]> {
    const users = await this.userModel.find().lean().exec();
    const userWithoutPassword = users.map(user => {
      const { password, ...restUser } = user;
      return restUser; 
    })
    return userWithoutPassword;
  }

  async getUserById(id: string){
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();

    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
