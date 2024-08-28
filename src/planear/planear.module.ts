import { Module, forwardRef } from '@nestjs/common';
import { PlanearService } from './planear.service';
import { PlanearController } from './planear.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Responsible, ResponsibleSchema } from './entities/responsible.entity';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
import { SubmoduleModule } from 'src/submodule/submodule.module';
import { ModuleModule } from 'src/module/module.module';
import { Document, DocumentSchema } from './entities/document.entity';
import { DocumentsResponsible, DocumentsResponsibleSchema } from 'src/report/entities/documentsResponsible.entity';
import { Company, CompanySchema } from 'src/configuration/entities/company.entity';

@Module({
  controllers: [PlanearController],
  providers: [PlanearService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { 
        name: Responsible.name, 
        schema: ResponsibleSchema 
      },
      { 
        name: Document.name, 
        schema: DocumentSchema 
      },
      { 
        name:  DocumentsResponsible.name, 
        schema: DocumentsResponsibleSchema 
      },
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
  exports: [PlanearService]
})
export class PlanearModule {}
