import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { AddTestPlanInput, TestPlan } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TestPlanService {

  constructor(private http: HttpClient) { }

  addTestPlan(input: AddTestPlanInput): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/TestPlan/AddTestPlan`, input).pipe(
      catchError(this.handleError)
    );
  }

  getTestPlansByProductId(productId: number): Observable<TestPlan[]> {
    return this.http.get<TestPlan[]>(apiConfig.uri + `/TestPlan/GetTestPlans/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  getTestPlanDetails(id: number, productId: number): Observable<any> {
    return this.http.get<any>(apiConfig.uri + `/TestPlan/GetTestPlanDetails/${id}/${productId}`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
