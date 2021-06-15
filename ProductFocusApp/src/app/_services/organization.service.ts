import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from '../b2c-config';
import {
  IAddOrganizationInput,
  IAddProductInOrganizationInput,
  IOrganization,
  IProduct,
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
    );
  }

  getOrganizationList(): Observable<IOrganization> {
    return this.http.get<IOrganization>(
      apiConfig.uri + '/Organization/GetOrganizationList'
    );
  }

  getProductsByOrganizationId(id: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      apiConfig.uri + `/Organization/GetProductsById/${id}`
    );
  }

  getOrganizationListByUser(): Observable<IOrganization> {
    return this.http.get<IOrganization>(
      apiConfig.uri + '/Organization/GetOrganizationListByUser'
    );
  }

  addProductInOrganization(
    id: number,
    addProductInOrganizationInput: IAddProductInOrganizationInput
  ) {
    return this.http.post(
      apiConfig.uri + `/Organization/AddProduct/${id}`,
      addProductInOrganizationInput
    );
  }
}
