export interface RequiredResponsibleDocumentsMain{
    statusDocumentation:          string;
    RequiredResponsibleDocuments: RequiredResponsibleDocuments[];
}

export interface RequiredResponsibleDocuments{
    title:              string;
    type:               number;
    required:           boolean;
    status:             boolean;
    disabled:           boolean;
    uploadFile:         boolean;        
    documents:          Documents1[];  
}

export interface Documents1 {
    _id:                 string;
    documentNumber:     number;
    documentType:       number;
    documentName:       string;
    documentNamePath:   string;
    documentPath:       string;
    documentSize:       string;
    documentExtention:  string;
    documentCreateId:   string;
    documentUpdateDate: string;
    documentUpdateHour: string;
    documentCreateDate: string;
    documentCreateHour: string;

}