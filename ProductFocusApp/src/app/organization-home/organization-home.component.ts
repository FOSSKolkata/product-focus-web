import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  IAddOrganizationInput,
} from '../dht-common/models';
import { OrganizationService } from '../_services/organization.service';

@Component({
  selector: 'app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.css'],
})
export class OrganizationHomeComponent implements OnInit {
  error!: HttpErrorResponse;
  constructor(
    private organizationService: OrganizationService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  organizationAddView: boolean = false;
  organizationName: string | undefined;
  selectedOrganization: any;
  organizationList: any = [];
  organizationSpinner = false;
  enabledAdding: boolean = true;
  ngOnInit(): void {
    this.setOrganizationList();
  }
  setOrganizationList() {
    this.organizationSpinner = true;
    this.organizationService.getOrganizationListByUser().subscribe(
      (res) => {
        console.log("orga: ", res);
        this.organizationSpinner = false;
        this.organizationList = res;
        if (this.organizationList.length >= 1) {
          this.selectOrganization(this.organizationList[0]);
          localStorage.selectedOrganization = JSON.stringify(this.organizationList[0]);
          this.router.navigate(['organization-home', this.organizationList[0].name]);
        }
      },
      (err) => {
        this.organizationSpinner = false;
        this.error = err;
        console.log(err);
      }
    );
  }

  addOrganization() {
    if (this.organizationName === undefined || this.organizationName == '') {
      return;
    }
    this.enabledAdding = false;
    var addOrganizationInput: IAddOrganizationInput = {
      organizationName: this.organizationName
    };
    this.organizationService.addOrganization(addOrganizationInput).subscribe(
      (res) => {
        // success
        this.toastr.success("Organization added.", "Success");
        this.organizationAddView = false;
        this.organizationName = '';
        this.setOrganizationList();
        this.enabledAdding = true;
      },
      (err) => {
        this.toastr.error("Organization not added", "Failed");
        this.enabledAdding = true;
      }
    );
  }

  selectOrganization(organization: any) {
    this.selectedOrganization = organization;
    localStorage.lastSelctedOrganizationId = this.selectedOrganization.id;
    localStorage.selectedOrganization = JSON.stringify(this.selectedOrganization);
    this.router.navigate(['./organization-home', organization.name]);
  }
}
