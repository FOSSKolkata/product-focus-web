import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IRelease } from '../dht-common/models';

@Injectable({
  providedIn: 'root'
})
export class ReleaseService {
  constructor(private http: HttpClient) { }

  createRelease(productId: number, release: IRelease): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/Release/CreateRelease/${productId}`, release)
      .pipe(
        catchError(this.handleError)
      );
  }

  getReleasesByProductId(productId: number): Observable<IRelease[]> {
    return this.http.get<IRelease[]>(apiConfig.uri + `/Release/GetReleasesByProductId/${productId}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  handleError(error:HttpErrorResponse){
    return throwError(error);
  }
}
