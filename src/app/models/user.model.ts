export interface UserPhone {
  id: number;
  phoneType: number;
  phoneNumber: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  birthdate: string;
  documentType: number;
  document: string;
  userPhones: UserPhone[];
  gender: string;
  userStatus: number;
  creationDate: string;
  allowNotification: string;
  role: number;
}

export interface UserData {
  data: User[];
}
