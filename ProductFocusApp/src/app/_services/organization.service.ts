import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }

  addOrganization(name: string){
    return this.http.post(apiConfig.uri+"/Organization/AddOrganization",{name});
  }

  getOrganizationList(){
    return this.http.get(apiConfig.uri+"/Organization/GetOrganizationList");
  }

  getProductsByOrganizationId(id: Number){
    return this.http.get(apiConfig.uri+`/Organization/GetProductsById/${id}`);
  }

  addProductInOrganization(id: Number, name: string){
    return this.http.post(apiConfig.uri+`/Organization/AddProduct/${id}/AddProduct`,{name});
  }
}
