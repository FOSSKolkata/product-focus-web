import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IFeatureInput, IModule } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  constructor(private http: HttpClient) {}
  
  addModule(id: Number, name: string): Observable<void> {
    return this.http
      .post<void>(apiConfig.uri + `/Module/AddModule/${id}`, { name })
      .pipe(catchError(this.handleError));
  }
  
  getModulesByProductId(id: Number): Observable<IModule[]> {
    return this.http
      .get<IModule[]>(apiConfig.uri + `/Module/GetModulesByProductId/${id}`)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
