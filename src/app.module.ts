import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ModuleModule } from './module/module.module';
import { SubmoduleModule } from './submodule/submodule.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //Imports of config,
    MongooseModule.forRoot(process.env.MONGO_URI), // Environment variable
    AuthModule, UserModule, ModuleModule, SubmoduleModule, RoleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
