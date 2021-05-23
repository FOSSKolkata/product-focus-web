import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';
import { ModifyFeatureInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(private http: HttpClient) { }

  modifyFeatureElement(modifyFeatureInput: ModifyFeatureInput){
    return this.http.put(apiConfig.uri+"/Feature/ModifyFeatureElement",modifyFeatureInput);
  }

  getFeatureDetailsById(id: number){
    return this.http.get(apiConfig.uri+`/Feature/GetFeatureDetailsById/${id}`);
  }
}
