import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import {
  IAddOrganizationInput,
  IOrganization,
} from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) {}

  addOrganization(data: IAddOrganizationInput) {
    return this.http.post(
      apiConfig.uri + '/Organization/AddOrganization',
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  getOrganizationList(): Observable<IOrganization> {
    return this.http.get<IOrganization>(
      apiConfig.uri + '/Organization/GetOrganizationList'
    ).pipe(
      catchError(this.handleError)
    );
  }

  getOrganizationListByUser(): Observable<IOrganization[]> {
    return this.http.get<IOrganization[]>(
      apiConfig.uri + '/Organization/GetOrganizationListByUser'
    ).pipe(
      catchError(this.handleError)
    );
  }

  getOrganizationByName(name: string): Observable<IOrganization> {
    return this.http.get<IOrganization>(
      apiConfig.uri + `/Organization/GetOrganizationByName/${name}`
    ).pipe(
      catchError(this.handleError)
    )
  }

  handleError(error: any) {
    return throwError(error);
  }
}
