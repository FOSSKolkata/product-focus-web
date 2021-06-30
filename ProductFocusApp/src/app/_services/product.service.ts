import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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
    return this.http
      .post(apiConfig.uri + `/Product/AddModule/${id}`, { name })
      .pipe(catchError(this.handleError));
  }

  getModulesByProductId(id: Number): Observable<IModule[]> {
    return this.http
      .get<IModule[]>(apiConfig.uri + `/Product/GetModulesByProductId/${id}`)
      .pipe(catchError(this.handleError));
  }

  getKanbanViewByProductId(id: number): Observable<IKanbanBoard[]> {
    return this.http
      .get<IKanbanBoard[]>(
        apiConfig.uri + `/Product/GetKanbanViewByProductId/${id}`
      )
      .pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  getKanbanViewByProductIdAndQuery(id: number, sprintId: number, userIds: number[] ):Observable<IKanbanBoard[]> {
    var userParam = "";
    for(let uid of userIds){
      userParam += `UserIds=${uid}&`;
    }
    userParam = userParam.substring(0,userParam.length-1);
    const options = { params: new HttpParams({fromString: `SprintId=${sprintId}&${userParam}`}) };
    return this.http
      .get<IKanbanBoard[]>(
        apiConfig.uri +
          `/Product/GetKanbanViewByProductIdAndQuery/${id}/query`,options
      )
      .pipe(catchError(this.handleError));
  }
}
