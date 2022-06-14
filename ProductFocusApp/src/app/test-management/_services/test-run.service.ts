import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { ITestRun, IMarkTestCasesVersion, IMarkTestCaseVersionStatus, IMarkTestStepVersionStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TestRunService {

  constructor(private http: HttpClient) { }

  createTestRun(testPlanId: number): Observable<number> {
    return this.http.post<number>(apiConfig.uri + `/TestRun/CreateTestRun/${testPlanId}`,{}).pipe(
      catchError(this.handleError)
    );
  }

  getTestRunById(id: number): Observable<ITestRun> {
    return this.http.get<ITestRun>(apiConfig.uri + `/TestRun/GetTestRunById/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  markTestCasesVersion(testRunId: number, testCases: IMarkTestCasesVersion[]): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/TestRun/MarkTestCasesVersion/${testRunId}`, testCases).pipe(
      catchError(this.handleError)
    );
  }

  markTestCaseStatusVersion(testRunId: number, testCase: IMarkTestCaseVersionStatus): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/TestRun/MarkTestCaseVersionStatus/${testRunId}`, testCase).pipe(
      catchError(this.handleError)
    );
  }
  
  markTestStepStatusVersion(testRunId: number, testCase: IMarkTestStepVersionStatus): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/TestRun/MarkTestStepVersionStatus/${testRunId}`, testCase).pipe(
      catchError(this.handleError)
    );
  } 

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
