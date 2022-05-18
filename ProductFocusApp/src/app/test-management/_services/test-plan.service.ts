import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from 'src/app/b2c-config';
import { AddTestPlanInput } from '../models.ts';

@Injectable({
  providedIn: 'root'
})
export class TestPlanService {

  constructor(private http: HttpClient) { }

  addTestPlan(input: AddTestPlanInput) {
    return this.http.post(apiConfig.uri + `/ProductTestPlan/AddTestPlan`, input);
  }
}
