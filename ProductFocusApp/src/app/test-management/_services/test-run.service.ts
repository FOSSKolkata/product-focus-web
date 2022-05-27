import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { ITestRun } from '../models.ts';

@Injectable({
  providedIn: 'root'
})
export class TestRunService {

  constructor(private http: HttpClient) { }

  createTestRun(testPlanId: number): Observable<number> {
    return this.http.post<number>(apiConfig.uri + `/TestRun/CreateTestRun/${testPlanId}`,{}).pipe(
      catchError(this.handleError)
    )
  }

  getTestRunById(id: number): Observable<ITestRun> {
    return this.http.get<ITestRun>(apiConfig.uri + `/TestRun/GetTestRunById/${id}`).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
