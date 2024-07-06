import { Module, forwardRef } from '@nestjs/common';
import { SubmoduleService } from './submodule.service';
import { SubmoduleController } from './submodule.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Submodule, SubmoduleSchema } from './entities/submodule.entity';
import { ModuleModule } from 'src/module/module.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  controllers: [SubmoduleController],
  providers: [SubmoduleService],
  imports: [
    MongooseModule.forFeature([
      { 
        name: Submodule.name, 
        schema: SubmoduleSchema 
      }
    ]),

    forwardRef(() => AuthModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => ModuleModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => RoleModule), // Usar forwardRef para manejar dependencia circular
  ],
  exports:[
    SubmoduleService
  ],
})
export class SubmoduleModule {}
