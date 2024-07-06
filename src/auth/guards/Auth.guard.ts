import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';
import { RoleService } from 'src/role/role.service';
import { SubmoduleResponse, UserParams } from '../interfaces/login-response';
import { ModuleService } from 'src/module/module.service';
import { SubmoduleService } from 'src/submodule/submodule.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public userParams: UserParams[];

  constructor(
    @Inject(forwardRef(() => RoleService)) private roleService: RoleService, // Inyecta RoleService
    @Inject(forwardRef(() => ModuleService)) private moduleService: ModuleService, // Inyecta RoleService
    @Inject(forwardRef(() => SubmoduleService)) private submoduleService: SubmoduleService, // Inyecta RoleService
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No se encuentra token en la petición');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );

      console.log(payload);
      
      const user = await this.authService.getUserById(payload.id)
      if (!user) throw new UnauthorizedException('Usuario no existe');
      if (!user.isActive) throw new UnauthorizedException('Usuario inactivo');


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
      }

      request['user'] = user;
      request['userParams'] = this.userParams;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('No se ha encontrado el token en la petición ó el usuario tiene credenciales invalidas, por favor comunicarse con el administrador del sistema');

    }

    
    
    console.log({ token });
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
