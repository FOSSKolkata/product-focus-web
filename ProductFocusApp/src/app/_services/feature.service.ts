import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IFeatureDetails } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(private http: HttpClient) {}

  modifyFeatureElement(modifyFeatureInput: any) {
    return this.http.put(
      apiConfig.uri + '/Feature/ModifyFeatureElement',
      modifyFeatureInput
    ).pipe(
      catchError(this.handleError)
    );
  }

  getFeatureDetailsById(
    orgId: number,
    id: number
  ): Observable<IFeatureDetails> {
    return this.http.get<IFeatureDetails>(
      apiConfig.uri + `/Feature/GetFeatureDetailsById/${orgId}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  upsertScrumComment(data: any){
    return this.http.post(apiConfig.uri + `/Feature/UpsertScrumComment`,data).pipe(
      catchError(this.handleError)
    );
  }

  upsertScrumWorkCompletionPercentage(data: any){
    return this.http.post(apiConfig.uri + `/Feature/UpsertScrumWorkCompletionPercentage`,data).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
