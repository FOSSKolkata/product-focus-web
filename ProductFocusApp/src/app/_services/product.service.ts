import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { GroupCategory, IAddProductInOrganizationInput, IKanban, IKanbanBoard, IModule, IProduct } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(apiConfig.uri + `/Product/GetProductById/${id}`)
      .pipe(catchError(this.handleError));
  }

  getKanbanViewByProductId(id: number): Observable<IKanbanBoard[]> {
    return this.http
      .get<IKanbanBoard[]>(
        apiConfig.uri + `/Product/GetKanbanViewByProductId/${id}`
      )
      .pipe(catchError(this.handleError));
  }

  getKanbanViewByProductIdAndQuery(id: number, sprintId: number | undefined, userIds: number[], groupCategory: GroupCategory):Observable<IKanban> {
    let userParam = "";
    for(let uid of userIds){
      userParam += `UserIds=${uid}&`;
    }
    userParam = userParam.substring(0,userParam.length-1);
    let options;
    if(sprintId) {
      options = { params: new HttpParams({fromString: `SprintId=${sprintId}&${userParam}`}) };
    } else {
      options = { params: new HttpParams({fromString: userParam})};
    }
    //const options = { params: new HttpParams({fromString: `SprintId=${sprintId}&${userParam}`}) };
    return this.http
      .get<IKanban>(
        apiConfig.uri +
          `/Product/GetKanbanViewByProductIdAndQuery/${id}/${groupCategory}/query`,options
      )
      .pipe(catchError(this.handleError));
  }
  
  addProductInOrganization(
    id: number,
    addProductInOrganizationInput: IAddProductInOrganizationInput
  ) {
    return this.http.post(
      apiConfig.uri + `/Product/AddProduct/${id}`,
      addProductInOrganizationInput
    ).pipe(
      catchError(this.handleError)
    );
  }
  getProductsByOrganizationId(id: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      apiConfig.uri + `/Product/GetProductsById/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
