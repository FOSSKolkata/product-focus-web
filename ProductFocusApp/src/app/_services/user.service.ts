import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';
import { IRegisterUserInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerUser(registerUserInput: IRegisterUserInput) {
    return this.http.post(
      apiConfig.uri + '/User/RegisterUser',
      registerUserInput
    );
  }
}
