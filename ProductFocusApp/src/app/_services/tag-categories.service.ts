import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';

@Injectable({
  providedIn: 'root'
})
export class TagCategoriesService {

  constructor(private http: HttpClient) { }

  getTagCategories(productId: number) {
    return this.http.get(
      apiConfig.uri + `/TagCategory/GetTagCategory/${productId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
