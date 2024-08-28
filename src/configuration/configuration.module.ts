import { forwardRef, Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './entities/company.entity';
import { RoleModule } from 'src/role/role.module';
import { SubmoduleModule } from 'src/submodule/submodule.module';
import { ModuleModule } from 'src/module/module.module';

@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { 
        name:  Company.name, 
        schema: CompanySchema 
      },
    ]),

    forwardRef(() => AuthModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => RoleModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => SubmoduleModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => ModuleModule), // Usar forwardRef para manejar dependencia circular
  ],
})
export class ConfigurationModule {}
