export interface Company {
    _id?:                                string;
    companyName:                         string;  
    companyDocumentType:                 string;
    companyDocumentNumber:               string;
    companyCity:                         string;
    companyAddress:                      string;
    companyPhoneNumber:                  string;
    companyEmail:                        string;
    companyIndustry:                     string;
    companyWebsite:                      string;
    companyRepresentativeName:           string;
    companyRepresentativeTypeDocument:   string;  
    companyRepresentativeDocumentNumber: string; 
    companyRepresentativeEmail?:         string; 
    companyRepresentativePhoneNumber:    string;
}