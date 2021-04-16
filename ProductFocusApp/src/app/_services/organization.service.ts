import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private BASE_URL: string = 'https://localhost:44388/Organization/';

  constructor(private http: HttpClient) { }

  addOrganization(name: string){
    return this.http.post(this.BASE_URL+"AddOrganization",{name});
  }

  getOrganizationList(){
    return this.http.get(this.BASE_URL+"GetOrganizationList");
  }
}
