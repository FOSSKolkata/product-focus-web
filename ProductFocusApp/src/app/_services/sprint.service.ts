import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { ISprint, ISprintInput, ISprintUpdate } from '../dht-common/models';

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

  updateSprint(id: number, productId: number, updateSprint: ISprintUpdate): Observable<void> {
    return this.http.put<void>(
      apiConfig.uri + `/Sprint/UpdateSprint/${id}/${productId}`, updateSprint
    ).pipe(
      catchError(this.handleError)
    )
  }

  deleteSprint(id: number): Observable<void> {
    return this.http.delete<void>(
      apiConfig.uri + `/Sprint/DeleteSprint/${id}`
    ).pipe(
      catchError(this.handleError)
    )
  }

  handleError(error:HttpErrorResponse){
    return throwError(error);
  }
}
