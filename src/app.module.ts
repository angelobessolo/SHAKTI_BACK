import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ModuleModule } from './module/module.module';
import { SubmoduleModule } from './submodule/submodule.module';
import { RoleModule } from './role/role.module';
import { PlanearModule } from './planear/planear.module';
import { ReportModule } from './report/report.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //Imports of config,
    MongooseModule.forRoot(process.env.MONGO_URI, {
      // https://railway.app/
      dbName: 'shakti-db'
    }), // Environment variable
    AuthModule, UserModule, ModuleModule, SubmoduleModule, RoleModule, PlanearModule, ReportModule, ConfigurationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
