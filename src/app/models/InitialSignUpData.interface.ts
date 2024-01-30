export interface InitialSignUpData {
  documentTypes: DocumentType[];
  genders: Gender[];
  phoneTypes: PhoneType[];
}

export interface CommonType {
  id: number;
  description: string;
}

export interface DocumentType extends CommonType {}
export interface Gender extends CommonType {}
export interface PhoneType extends CommonType {}
