import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
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
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getUserListByOrganization(id: number): Observable<IMemberDetailsList> {
    return this.http.get<IMemberDetailsList>(apiConfig.uri + `/User/GetUserListByOrganization/${id}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  handleError(error:HttpErrorResponse){
    return throwError(error);
  }
}
