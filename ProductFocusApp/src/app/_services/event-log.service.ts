import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';

@Injectable({
  providedIn: 'root'
})
export class EventLogService {

  constructor(private http: HttpClient) { }

  getEventLog(productId: number, offset: number, count: number, moduleIds: number[], userIds: number[], startDate: Date | undefined, endDate: Date | undefined): any {
    let moduleParam = "";
    let userParam = "";
    for(let moduleId of moduleIds){
      moduleParam += `moduleIds=${moduleId}&`;
    }
    for(let userId of userIds) {
      userParam += `userIds=${userId}&`;
    }

    let dateParam = (startDate  !== undefined && endDate !== undefined)?`&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`:'';

    const options = { params: new HttpParams({fromString: `${moduleParam}${userParam}${dateParam}`}) };
    return this.http.get(apiConfig.uri+`/DomainEventLog/GetEventLog/${productId}/${offset}/${count}/query`,options).pipe(
      catchError(this.handleError)
    );
  }
  
  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
