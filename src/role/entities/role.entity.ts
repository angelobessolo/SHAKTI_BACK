import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Role {
    @Prop({ required: true, unique: true })
    roleName: string;

    @Prop({ required: true })
    roleModules: string[];

    @Prop({default: true})
    roleIsActive: boolean;

    @Prop({required: true})
    roleUserCreateId: string; // Usuario de creacion del modulo 
  
    @Prop({ default: Date.now })
    roleCreatedAt?: Date; // Fecha de creación del módulo
  
    @Prop({ default: Date.now })
    roleUpdatedAt?: Date; // Fecha de última modificación del módulo
}

export const RoleSchema = SchemaFactory.createForClass(Role);
