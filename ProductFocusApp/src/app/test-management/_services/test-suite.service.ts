import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { ITestSuiteOrder, TestSuiteInput } from '../models.ts';

@Injectable({
  providedIn: 'root'
})
export class TestSuiteService {

  constructor(private http: HttpClient) { }

  addTestSuite(testSuiteInput: TestSuiteInput): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/TestSuite/AddTestSuite`, testSuiteInput).pipe(
      catchError(this.handleError)
    );
  }

  deleteTestSuite(planId: number, suiteId: number): Observable<void> {
    return this.http.delete<void>(apiConfig.uri + `/TestSuite/DeleteTestSuite/${planId}/${suiteId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateTestSuiteOrdering(testPlanId: number, testSuiteIds: ITestSuiteOrder[]){
    return this.http.put<void>(apiConfig.uri + `/TestSuite/UpdateTestSuiteOrdering/${testPlanId}`,testSuiteIds).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
