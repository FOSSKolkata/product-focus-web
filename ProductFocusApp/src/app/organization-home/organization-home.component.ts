import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'xng-breadcrumb';
import {
  IAddOrganizationInput, IAddProductInOrganizationInput, IOrganization, IProduct,
} from '../dht-common/models';
import { OrganizationService } from '../_services/organization.service';

@Component({
  selector: 'app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.scss'],
})
export class OrganizationHomeComponent implements OnInit {
  error!: HttpErrorResponse;
  @ViewChild('addOrganizationRef') addOrganizationRef!: ElementRef;
  @ViewChild('addProductRef') addProductRef!: ElementRef;
  @HostListener('document:click',['$event'])
  click(event: any): void {
    if(!!this.addOrganizationRef && !this.addOrganizationRef.nativeElement.contains(event.target)) {
      this.organizationAddView = false;
      this.organizationName = '';
    }
    if(!!this.addProductRef && !this.addProductRef.nativeElement.contains(event.target)) {
      this.productAddView = false;
      this.productName = '';
    }
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any): void {
    this.route.params.subscribe(param => {
      let organizationName = param.organizationName;
      for(let currOrg of this.organizationList){
        if(currOrg.name == organizationName) {
          this.selectOrganization(currOrg);
        }
      }
    });
  }

  constructor(
    private organizationService: OrganizationService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) { }

  organizationAddView: boolean = false;
  organizationName: string | undefined;
  selectedOrganization: any;
  organizationList: IOrganization[] = [];
  organizationSpinner = false;
  enabledAdding: boolean = true;
  
  productSpinner = false;
  productList: IProduct[] = [];
  productName: string | undefined;
  productAddView: boolean = false;
  paramOrganization: string | undefined;
  
  ngOnInit(): void {
    this.paramOrganization = this.route.snapshot.params["organizationName"];
    this.setOrganizationList();
  }

  setOrganizationList() {
    this.organizationSpinner = true;
    this.organizationService.getOrganizationListByUser().subscribe(
      (res) => {
        this.organizationSpinner = false;
        this.organizationList = res;
        if(this.paramOrganization !== undefined && this.isValidOrganization(this.paramOrganization,this.organizationList)){
          var selectedOrganization = this.getParamOrganization(this.paramOrganization,this.organizationList);
          this.selectOrganization(selectedOrganization);
        }
        else if (this.organizationList.length >= 1) {
          this.selectOrganization(this.organizationList[0]);
        }
      },
      (err) => {
        this.organizationSpinner = false;
        this.error = err;
      }
    );
  }
  
  getParamOrganization(paramOrganization: string, organizationList: IOrganization[]): IOrganization {
    for(let org of organizationList){
      if(org.name == paramOrganization){
        return org;
      }
    }
    return organizationList[0]; // Update this in future
  }

  addOrganization() {
    if (this.organizationName === undefined || this.organizationName == '') {
      return;
    }
    this.enabledAdding = false;
    var addOrganizationInput: IAddOrganizationInput = {
      organizationName: this.organizationName.trim()
    };
    this.organizationService.addOrganization(addOrganizationInput).subscribe(
      (res) => {
        this.toastr.success("Organization added.", "Success");
        this.organizationAddView = false;
        this.organizationName = '';
        this.setOrganizationList();
        this.enabledAdding = true;
      },
      (err) => {
        this.toastr.error(err.error, "Failed");
        this.enabledAdding = true;
      }
    );
  }

  selectOrganization(organization: IOrganization) {
    this.selectedOrganization = organization;
    this.breadcrumbService.set('organizations/:organization-name', organization.name);
    this.router.navigate(['organizations', organization.name]);
    if(this.selectedOrganization !== undefined){
      this.setProductList(this.selectedOrganization.id);
    }
  }

  setProductList(id: number) {
    this.productSpinner = true;
    this.productList = [];
    this.organizationService.getProductsByOrganizationId(id).subscribe(
      (res) => {
        this.productSpinner = false;
        this.productList = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }
  
  addProduct() {
    if (this.productName === undefined || this.productName == '') {
      return;
    }
    if (this.selectedOrganization == undefined) return;
    this.enabledAdding = false;
    var addProductInOrganizationInput: IAddProductInOrganizationInput = {
      name: this.productName.trim(),
    };
    this.organizationService
      .addProductInOrganization(
        this.selectedOrganization.id,
        addProductInOrganizationInput
      )
      .subscribe(
        (res) => {
          this.toastr.success("Product added.","Success");
          this.productName = '';
          this.productAddView = false;
          this.enabledAdding = true;
          if (this.selectedOrganization != undefined)
            this.setProductList(this.selectedOrganization.id);
        },
        (err) => {
          this.toastr.error(err.error,"Failed");
          this.enabledAdding = true;
        }
      );
  }
  
  isValidOrganization(paramOrganization: string, organizationList: IOrganization[]): boolean {
    for(let org of organizationList){
      if(org.name == paramOrganization){
        return true;
      }
    }
    return false;
  }

}