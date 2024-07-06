import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Submodule {
    _id?: string;

    @Prop({required: true, unique: true})
    submoduleName: string; // Nombre del modulo
  
    @Prop({default: ''})
    submoduleIcon: string; // Icono del modulo

    @Prop({default: ''})
    submoduleRoute: string; // Icono del modulo
  
    @Prop({default: ''})
    submoduleDescription?: string; // Descripcion general
  
    @Prop({default: ['view']})
    submodulePermissions?: string[]; // Permisos asignados al modulo
  
    @Prop({ default: false })
    submoduleExpanded?: boolean; // Indicador de si el módulo está expandido o colapsado
  
    @Prop({default: true})
    submoduleActive: boolean; // Activo / Inactivo 

    @Prop()
    submoduleItems: string[]; // Array de nombres de submódulos
  
    @Prop({required: true})
    submoduleUserCreateId: string; // Usuario de creacion del modulo 
  
    @Prop({ default: Date.now })
    submoduleCreatedAt?: Date; // Fecha de creación del módulo
  
    @Prop({ default: Date.now })
    submoduleUpdatedAt?: Date; // Fecha de última modificación del módulo  
}

export const SubmoduleSchema = SchemaFactory.createForClass(Submodule);
