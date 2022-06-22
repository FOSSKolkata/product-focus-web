import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from 'src/app/b2c-config';
import { Release } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseService {

  constructor(private http: HttpClient) { }

  createRelease(productId: number, release: Release): Observable<void> {
    return this.http.post<void>(apiConfig.uri + `/Release/CreateRelease/${productId}`, release);
  }
}
