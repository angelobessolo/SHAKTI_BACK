import { forwardRef, Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
import { SubmoduleModule } from 'src/submodule/submodule.module';
import { ModuleModule } from 'src/module/module.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsResponsible, DocumentsResponsibleSchema } from './entities/documentsResponsible.entity';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [
    MongooseModule.forFeature([
      { 
        name:  DocumentsResponsible.name, 
        schema: DocumentsResponsibleSchema 
      },
    ]),
    forwardRef(() => AuthModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => RoleModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => SubmoduleModule), // Usar forwardRef para manejar dependencia circular
    forwardRef(() => ModuleModule), // Usar forwardRef para manejar dependencia circular
  ]
})
export class ReportModule {}
