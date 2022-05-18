import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from 'src/app/b2c-config';
import { AddTestPlanInput, TestPlan } from '../models.ts';

@Injectable({
  providedIn: 'root'
})
export class TestPlanService {

  constructor(private http: HttpClient) { }

  addTestPlan(input: AddTestPlanInput): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/ProductTestPlan/AddTestPlan`, input);
  }

  getTestPlansByProductId(productId: number): Observable<TestPlan[]> {
    return this.http.get<TestPlan[]>(apiConfig.uri + `/ProductTestPlan/GetTestPlans/${productId}`);
  }

  getTestPlanDetails(id: number, productId: number): Observable<any> {
    return this.http.get<any>(apiConfig.uri + `/ProductTestPlan/GetTestPlanDetails/${id}/${productId}`);
  }
}
