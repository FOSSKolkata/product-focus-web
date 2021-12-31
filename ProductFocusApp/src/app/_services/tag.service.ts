import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IAddTag, ITag } from '../dht-common/models';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  addTag(productId: number, tag: IAddTag) {
    return this.http.post(apiConfig.uri + `/Tag/AddTag/${productId}`, tag).pipe(
      catchError(this.handleError)
    );
  }

  getTagListByProductId(productId: number): Observable<ITag[]> {
    return this.http.get<ITag[]>(apiConfig.uri + `/Tag/GetTagList/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteTagById(tagId: number) {
    return this.http.delete(apiConfig.uri + `/Tag/DeleteTag/${tagId}`).pipe(
      catchError(this.handleError)
    );
  }
  
  handleError(error:HttpErrorResponse){
    return throwError(error);
  }
}
