import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { TestResultItem, TestTypeEnum } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TestResultService {

  constructor(private http: HttpClient) { }

  getTestResultsByTestPlanId(testPlanId: number, searchTitle?: string, searchTestTypes?: TestTypeEnum[]): Observable<TestResultItem[]> {
    let options;
    let query;
    if(searchTitle) {
      query = `searchTitle=${searchTitle}`
    }
    for(let type of searchTestTypes??[]) {
      query += `&searchTestTypes=${type}`;
    }
    options = { params: new HttpParams({fromString: query}) };
    return this.http.get<TestResultItem[]>(apiConfig.uri + `/TestResult/GetTestResultsByTestPlanId/${testPlanId}`,options).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
