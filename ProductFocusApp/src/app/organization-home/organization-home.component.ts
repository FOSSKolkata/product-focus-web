import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { ToastrService } from 'ngx-toastr';
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
  constructor(
    private organizationService: OrganizationService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumb: BreadcrumbService
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
    this.paramOrganization = this.route.snapshot.params["organization-name"];
    this.setOrganizationList();
  }
  setOrganizationList() {
    this.organizationSpinner = true;
    this.organizationService.getOrganizationListByUser().subscribe(
      (res) => {
        console.log("orga: ", res);
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
        console.log(err);
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

  selectOrganization(organization: IOrganization) {
    this.selectedOrganization = organization;
    localStorage.lastSelctedOrganizationId = this.selectedOrganization.id;
    localStorage.selectedOrganization = JSON.stringify(this.selectedOrganization);
    this.router.navigate(['organizations', organization.name]);
    this.breadcrumb.changeBreadcrumb(this.route.snapshot,organization.name);
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
        console.log(res);
      },
      (err) => {
        alert(err);
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
      name: this.productName,
    };
    console.log('h');
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
          this.toastr.error("Product not added","Failed");
          this.enabledAdding = true;
        }
      );
  }
  
  setLastProductId(product: any) {
    localStorage.setItem('productId', product.id.toString());
    localStorage.selectedProduct = JSON.stringify(product);
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

