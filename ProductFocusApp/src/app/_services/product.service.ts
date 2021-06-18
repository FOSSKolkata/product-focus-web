import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IKanbanBoard, IModule } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  addModule(id: Number, name: string) {
    return this.http.post(apiConfig.uri + `/Product/AddModule/${id}`, { name }).pipe(
      catchError(this.handleError)
    );
  }

  getModulesByProductId(id: Number): Observable<IModule[]> {
    return this.http.get<IModule[]>(
      apiConfig.uri + `/Product/GetModulesByProductId/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  getKanbanViewByProductId(id: number): Observable<IKanbanBoard[]> {
    return this.http.get<IKanbanBoard[]>(
      apiConfig.uri + `/Product/GetKanbanViewByProductId/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }
  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
