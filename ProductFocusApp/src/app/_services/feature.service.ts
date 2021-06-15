import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from '../b2c-config';
import { IFeatureDetails } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(private http: HttpClient) {}

  modifyFeatureElement(modifyFeatureInput: any) {
    return this.http.put(
      apiConfig.uri + '/Feature/ModifyFeatureElement',
      modifyFeatureInput
    );
  }

  getFeatureDetailsById(
    orgId: number,
    id: number
  ): Observable<IFeatureDetails> {
    return this.http.get<IFeatureDetails>(
      apiConfig.uri + `/Feature/GetFeatureDetailsById/${orgId}/${id}`
    );
  }
}
