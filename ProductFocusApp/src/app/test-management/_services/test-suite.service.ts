import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { TestSuiteInput } from '../models.ts';

@Injectable({
  providedIn: 'root'
})
export class TestSuiteService {

  constructor(private http: HttpClient) { }

  addTestSuite(testSuiteInput: TestSuiteInput): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/ProductTestSuite/AddTestSuite`, testSuiteInput).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
