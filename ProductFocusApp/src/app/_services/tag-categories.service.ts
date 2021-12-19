import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IAddTagCategory, ITagCategory } from '../dht-common/models';

@Injectable({
  providedIn: 'root'
})
export class TagCategoriesService {

  constructor(private http: HttpClient) { }

  getTagCategories(productId: number): Observable<ITagCategory[]> {
    return this.http.get<ITagCategory[]>(
      apiConfig.uri + `/TagCategory/GetTagCategories/${productId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  addTagCategories(productId: number, addTagCategory: IAddTagCategory) {
    return this.http.post(
      apiConfig.uri + `/TagCategory/AddTagCategory/${productId}`, addTagCategory
    ).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
