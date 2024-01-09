import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  login(formData: { email: string; password: string }): boolean {
    return true;
  }
}
