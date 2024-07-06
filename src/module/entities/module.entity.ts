import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Module {
  _id?: string;

  @Prop({required: true, unique: true})
  moduleName: string; // Nombre del modulo

  @Prop({default: 'settings'})
  moduleIcon: string; // Icono del modulo

  @Prop({default: ''})
  moduleRoute: string; // Icono del modulo

  @Prop({default: ''})
  moduleDescription?: string; // Descripcion general

  @Prop({default: ['view']})
  modulePermissions?: string[]; // Permisos asignados al modulo

  @Prop({ default: false })
  moduleExpanded?: boolean; // Indicador de si el módulo está expandido o colapsado

  @Prop({default: true})
  moduleActive: boolean; // Activo / Inactivo 

  @Prop({ type: [String], default: [] })
  moduleSubmodules: string[]; // Array de nombres de submódulos

  @Prop({required: true})
  moduleUserCreateId: string; // Usuario de creacion del modulo 

  @Prop({ default: Date.now })
  moduleCreatedAt?: Date; // Fecha de creación del módulo

  @Prop({ default: Date.now })
  moduleUpdatedAt?: Date; // Fecha de última modificación del módulo
}

export const ModuleSchema = SchemaFactory.createForClass(Module);