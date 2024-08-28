import { Module, forwardRef } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema } from './entities/module.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { RoleModule } from 'src/role/role.module';
import { SubmoduleModule } from 'src/submodule/submodule.module';
import { PlanearModule } from 'src/planear/planear.module';

@Module({
  controllers: [ModuleController],
  providers: [ModuleService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { 
        name: Module.name, 
        schema: ModuleSchema 
      }
    ]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    forwardRef(() => AuthModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => RoleModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => SubmoduleModule), // Usar forwardRef para manejar dependencia circular
  ],
  exports: [ModuleService]
})
export class ModuleModule {}
