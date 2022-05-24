import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { TestCase, TestCaseInput, UpdateTestCaseInput } from '../models.ts';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {

  constructor(private http: HttpClient) { }

  addTestCase(testCaseInput: TestCaseInput): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/ProductTestCase/AddTestCase`, testCaseInput).pipe(
      catchError(this.handleError)
    );
  }

  updateTestCase(id: number,testCase: UpdateTestCaseInput): Observable<void> {
    return this.http.put<void>(apiConfig.uri + `/ProductTestCase/UpdateTestCase/${id}`,testCase).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
