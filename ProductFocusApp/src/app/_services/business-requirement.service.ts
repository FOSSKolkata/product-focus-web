import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IBusinessRequirementDetails, IBusinessRequirementInput } from '../dht-common/models';

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

  getBusinessRequirementListByProductId(productId: number, tags: number[], startDate: Date, endDate: Date) {
    let tagParam = "";
    for(let tid of tags){
      tagParam += `TagIds=${tid}&`;
    }
    tagParam = tagParam.substring(0,tagParam.length-1);
    let options;
    if(startDate && endDate) {
      options = { params: new HttpParams({fromString: `StartDate=${startDate}EndDate=${endDate}&${tagParam}`}) };
    }
    else if(startDate) {
      options = { params: new HttpParams({fromString: `StartDate=${startDate}&${tagParam}`}) };
    }
    else if(endDate) {
      options = { params: new HttpParams({fromString: `StartDate=${endDate}&${tagParam}`}) };
    }
    else {
      options = { params: new HttpParams({fromString: tagParam})};
    }
    return this.http
      .get(
        apiConfig.uri +
        `/BusinessRequirement/GetBusinessRequirementsByProductId/${productId}/query`, options
      )
      .pipe(catchError(this.handleError));
  }

  getBusinessRequirementDetails(id: number): Observable<IBusinessRequirementDetails> {
    return this.http
      .get<IBusinessRequirementDetails>(
        apiConfig.uri + 
        `/BusinessRequirement/GetBusinessRequirementDetails/${id}`
      )
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
