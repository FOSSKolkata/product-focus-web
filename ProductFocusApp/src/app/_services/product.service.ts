import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  addModule(id: Number, name: string){
    return this.http.post(apiConfig.uri+`/Product/AddModule/${id}`,{name});
  }

  getModulesByProductId(id: Number){
    return this.http.get(apiConfig.uri+`/Product/GetModulesByProductId/${id}`);
  }
}
