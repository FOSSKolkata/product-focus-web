import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';

@Injectable({
  providedIn: 'root'
})
export class TestRunService {

  constructor(private http: HttpClient) { }

  createTestRun(testPlanId: number): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/ProductTestRun/CreateTestRun/${testPlanId}`,{}).pipe(
      catchError(this.handleError)
    )
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
