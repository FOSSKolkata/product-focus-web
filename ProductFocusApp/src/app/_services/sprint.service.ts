import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from '../b2c-config';
import { SprintInput } from '../dht-common/models';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  constructor(private http: HttpClient) { }

  addSprint(sprintInput: SprintInput){
    return this.http.post(apiConfig.uri+"/Sprint/AddSprint",sprintInput);
  }
}
