import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from '../b2c-config';
import { IMemberDetailsList, IRegisterUserInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  registerUser(registerUserInput: IRegisterUserInput) {
    return this.http.post(
      apiConfig.uri + '/User/RegisterUser',
      registerUserInput
    );
  }

  getUserListByOrganization(id: number): Observable<IMemberDetailsList> {
    return this.http.get<IMemberDetailsList>(apiConfig.uri + `/User/GetUserListByOrganization/${id}`);
  }
}
