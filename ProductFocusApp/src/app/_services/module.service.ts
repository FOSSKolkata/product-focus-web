import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IFeatureInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  constructor(private http: HttpClient) {}
  addFeatureInModule(id: number, featureInput: IFeatureInput) {
    return this.http.post(
      apiConfig.uri + `/Module/AddFeature/${id}`,
      featureInput
    ).pipe(
      catchError(this.handleError)
    );
  }
  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
