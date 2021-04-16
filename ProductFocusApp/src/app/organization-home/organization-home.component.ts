import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../_services/organization.service';

@Component({
  selector: 'app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.css']
})
export class OrganizationHomeComponent implements OnInit {

  constructor(private organizationService: OrganizationService) { }
  active: boolean = false;
  addView: boolean = false;
  organizationName: string | undefined;
  organizationList: any = {};
  ngOnInit(): void {
    this.fetchOrganizationList();
  }
  fetchOrganizationList(){
    this.organizationService.getOrganizationList().subscribe(res => {
      this.organizationList = res;
    })
  }
  addOrganization(){
    if(this.organizationName === undefined || this.organizationName == ''){
      return;
    }
    this.organizationService.addOrganization(this.organizationName).subscribe(res => {
      // success
      this.addView = false;
      this.organizationName = '';
      this.fetchOrganizationList();
    },err=> {
      alert(err);
    })
  }
}
