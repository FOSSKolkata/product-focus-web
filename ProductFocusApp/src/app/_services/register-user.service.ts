import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';
import { RegisterUserInput } from '../kanban-board/models';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor(private http: HttpClient) { }

  registerUser(registerUserInput: RegisterUserInput){
    return this.http.post(apiConfig.uri+"/User/RegisterUser",registerUserInput);
  }
}
