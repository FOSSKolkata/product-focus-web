import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { ISprint, ISprintInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  constructor(private http: HttpClient) {}

  addSprint(sprintInput: ISprintInput) {
    return this.http.post(apiConfig.uri + '/Sprint/AddSprint', sprintInput).pipe(
      catchError(this.handleError)
    ).pipe(
      catchError(this.handleError)
    );
  }

  getSprintByProductId(id: number): Observable<ISprint[]> {
    return this.http.get<ISprint[]>(
      apiConfig.uri + `/Sprint/GetSprintsByProductId/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }
  handleError(error:HttpErrorResponse){
    return throwError(error);
  }
}
