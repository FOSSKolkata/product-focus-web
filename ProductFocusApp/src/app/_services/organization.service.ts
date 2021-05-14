import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';
import { AddOrganizationInput, AddProductInOrganizationInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

  constructor(private http: HttpClient) { }

  addOrganization(data: AddOrganizationInput){
    return this.http.post(apiConfig.uri+"/Organization/AddOrganization",data);
  }

  getOrganizationList(){
    return this.http.get(apiConfig.uri+"/Organization/GetOrganizationList");
  }

  getProductsByOrganizationId(id: number){
    return this.http.get(apiConfig.uri+`/Organization/GetProductsById/${id}`);
  }

  getOrganizationByUserid(id: number){
    return this.http.get(apiConfig.uri+`/Organization/GetOrganizationListByUser/${id}`);
  }

  addProductInOrganization(id: number, addProductInOrganizationInput: AddProductInOrganizationInput){
    return this.http.post(apiConfig.uri+`/Organization/AddProduct/${id}/AddProduct`,addProductInOrganizationInput);
  }
}
