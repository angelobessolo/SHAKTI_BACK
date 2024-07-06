import { User } from "../entities/user.entity";

export interface LoginResponse{
    user: User;
    userParams: UserParams[];
    token: string;
}

export interface UserParams {
    moduleName: string;
    moduleIcon?: string;
    moduleDescription?: string;
    moduleRoute?: string;
    submodules?: SubmoduleResponse[];
}
  
export interface SubmoduleResponse {
    submoduleName: string;
    submoduleIcon?: string;
    submoduleDescription?: string;
    submoduleRoute?: string;
    submoduleItems?: string[];
}

