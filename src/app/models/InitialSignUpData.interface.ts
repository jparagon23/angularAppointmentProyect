export interface InitialSignUpData {
  documentTypes: DocumentType[];
  genders: Gender[];
  phoneTypes: PhoneType[];
  categories: Category[];
}

export interface CommonType {
  id: number | string;
  description: string;
}

export interface Category {
  id: number;
  description: string;
  lowerRating: number;
  upperRating: number;
  briefDescription: string;
}

export interface DocumentType extends CommonType {}
export interface Gender extends CommonType {}
export interface PhoneType extends CommonType {}
