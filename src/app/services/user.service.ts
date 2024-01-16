import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private initialSignUpData: any;

  constructor(private http: HttpClient) {}

  createUser(formData: any) {
    return this.http.post(`${base_url}/user/signup`, formData).subscribe();
  }

  login(formData: { email: string; password: string }): boolean {
    return true;
  }

  getInitialSignUpData() {}
}
