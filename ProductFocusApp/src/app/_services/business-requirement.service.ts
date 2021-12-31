import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IBusinessRequirementInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root'
})
export class BusinessRequirementService {

  constructor(private http: HttpClient) { }

  addBusinessRequirement(input: IBusinessRequirementInput) {
    return this.http.post(apiConfig.uri+`/BusinessRequirement/AddBusinessRequirement`,input).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
