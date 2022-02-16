import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from 'src/app/b2c-config';
import { AddProductDocumentation, ProductDocumentation, ProductDocumentationDetails } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ProductDocumentationService {

  constructor(private http: HttpClient) { }

  addProductDocumentation(addProductDocumentation: AddProductDocumentation) {
    return this.http.post<AddProductDocumentation>(apiConfig.uri + `/ProductDocumentation/AddProductDocumentation`, addProductDocumentation)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProductDocumentations(productId: number): Observable<ProductDocumentation[]> {
    return this.http.get<ProductDocumentation[]>(apiConfig.uri + `/ProductDocumentation/GetProductDocumentations/${productId}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getProductDocumentationDetails(id: number, index: number): Observable<ProductDocumentationDetails[]> {
    return this.http.get<ProductDocumentationDetails[]>(apiConfig.uri + `/ProductDocumentation/GetProductDocumentationById/${id}/${index}`)
      .pipe(
        catchError(this.handleError)
      )
  }
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
