import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IMemberDetailsList, IRegisterUserInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isUserPresentInLocalDb: boolean | null = null;
  constructor(private http: HttpClient, 
    private authService: MsalService) { }

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

  getUserByEmail(email: string): Observable<any>{
    const options = { params: new HttpParams({fromString: `email=${email}`}) };
    return this.http.get(apiConfig.uri+'/User/GetUserByEmail',options);
  }

  async doesUserExistInApplicationDb(): Promise<boolean> {
    const email = this.authService.instance.getAllAccounts()[0].username;
    if(this.isUserPresentInLocalDb != null && this.isUserPresentInLocalDb){
      return true;
    }
    const options = { params: new HttpParams({fromString: `email=${email}`}) };
    if(await this.http.get(apiConfig.uri+'/User/GetUserByEmail',options).toPromise().then(x => x != 0)){
      return this.isUserPresentInLocalDb = true;
    }
    var userInfo: any = this.authService.instance.getAllAccounts();
    var user: IRegisterUserInput = {
      name:
        userInfo[0].idTokenClaims.given_name +
        ' ' +
        userInfo[0].idTokenClaims.family_name,
      email: email,
    };
    return await this.registerUser(user).toPromise().then(res => { console.log(res,"res"); return res != 0;},err=> {console.log("err",err); return false});
  }
}

