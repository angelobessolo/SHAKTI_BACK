
// Define una interfaz que extienda el tipo de documento Mongoose
export interface ResponsibleAssignments {
    _id:                             string;
    documentsResponsibleId:          string;
    documentsResponsibleName:        string;
    documentsResponsibleCompanyId:   string;
    documentsResponsibleCompanyName: string;
    documentsResponsibleNamePath:    string;
    documentsResponsiblePath:        string;
    documentsResponsibleSize:        string;
    documentsResponsibleExtention:   string; 
    documentsResponsibleCreateId:    string; 
    documentsResponsibleUpdateDate:  string;
    documentsResponsibleUpdateHour:  string;
    documentsResponsibleCreateDate:  string;
    documentsResponsibleCreateHour:  string;

}
