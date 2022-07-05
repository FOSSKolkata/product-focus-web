import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { Feature, ICurrentProgressWorkItemDetails, IFeatureDetails, OrderingInfo } from '../dht-common/models';
import { IWorkItem } from '../model';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(private http: HttpClient) {}

  // getFeatureOrderingByProductIdAndCategory(prodId: number, sprintId: number, category: OrderingCategoryEnum): Observable<FeatureOrdering[]> {
  //   return this.http.get<FeatureOrdering[]>(
  //     apiConfig.uri + `/Feature/GetFeatureOrderingByProductIdAndCategory/${prodId}/${sprintId}/${category}`
  //   ).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  modifyFeatureOrder(orderInput: OrderingInfo) {
    return this.http.post(
      apiConfig.uri + '/Feature/UpdateFeaturesOrdering',orderInput
    ).pipe(
      catchError(this.handleError)
    );
  }

  modifyFeatureElement(modifyFeatureInput: any) {
    return this.http.put(
      apiConfig.uri + '/Feature/ModifyFeatureElement',
      modifyFeatureInput
    ).pipe(
      catchError(this.handleError)
    );
  }

  getFeatureDetailsById(
    orgId: number,
    id: number
  ): Observable<IFeatureDetails> {
    return this.http.get<IFeatureDetails>(apiConfig.uri + `/Feature/GetFeatureDetailsById/${orgId}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getFeatureListByProductId(productId: number): Observable<Feature[]> {
    return this.http.get<Feature[]>(
      apiConfig.uri + `/Feature/GetFeatureListByProductId/${productId}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  upsertScrumComment(data: any){
    return this.http.post(apiConfig.uri + `/Feature/UpsertScrumComment`,data)
    .pipe(
      catchError(this.handleError)
    );
  }

  upsertScrumWorkCompletionPercentage(data: any){
    return this.http.post(apiConfig.uri + `/Feature/UpsertScrumWorkCompletionPercentage`,data)
    .pipe(
      catchError(this.handleError)
    );
  }

  getMyWorkItemsInProduct(productId: number): Observable<IWorkItem[]> {
    return this.http.get<IWorkItem[]>(apiConfig.uri + `/Feature/GetMyWorkItemsByProductId/${productId}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  markWorkItemAsCurrentlyProgress(productId: number, workItemId: number): Observable<ICurrentProgressWorkItemDetails> {
    return this.http.post<ICurrentProgressWorkItemDetails>(
      apiConfig.uri + `/Feature/MarkWorkItemAsCurrentlyProgress/${productId}/${workItemId}`,{})
      .pipe(
        catchError(this.handleError)
      )
  }

  getCurrentProgressWorkItemId(productId: number): Observable<ICurrentProgressWorkItemDetails> {
    return this.http.get<ICurrentProgressWorkItemDetails>(apiConfig.uri + `/Feature/GetCurrentProgressWorkItemId/${productId}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
