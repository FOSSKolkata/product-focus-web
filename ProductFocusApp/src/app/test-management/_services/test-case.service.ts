import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { TestCaseInput, UpdateTestCaseInput } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {

  constructor(private http: HttpClient) { }

  addTestCase(testCaseInput: TestCaseInput): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/TestCase/AddTestCase`, testCaseInput).pipe(
      catchError(this.handleError)
    );
  }

  updateTestCase(id: number,testCase: UpdateTestCaseInput): Observable<void> {
    return this.http.put<void>(apiConfig.uri + `/TestCase/UpdateTestCase/${id}`,testCase).pipe(
      catchError(this.handleError)
    );
  }

  deleteTestCase() {
    // work on it
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
