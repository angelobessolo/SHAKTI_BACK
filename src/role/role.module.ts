import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ModuleModule } from 'src/module/module.module';
import { SubmoduleModule } from 'src/submodule/submodule.module';
import { PlanearModule } from 'src/planear/planear.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { 
        name: Role.name, 
        schema: RoleSchema 
      }
    ]),

    forwardRef(() => AuthModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => ModuleModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => SubmoduleModule), // Usar forwardRef para manejar dependencia circular
  ],
  exports: [RoleService]
})
export class RoleModule {}
