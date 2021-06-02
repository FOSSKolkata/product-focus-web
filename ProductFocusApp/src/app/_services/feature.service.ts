import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(private http: HttpClient) { }

  modifyFeatureElement(modifyFeatureInput: any){
    return this.http.put(apiConfig.uri+"/Feature/ModifyFeatureElement",modifyFeatureInput);
  }

  getFeatureDetailsById(orgId: number, id: number){
    return this.http.get(apiConfig.uri+`/Feature/GetFeatureDetailsById/${orgId}/${id}`);
  }
}
