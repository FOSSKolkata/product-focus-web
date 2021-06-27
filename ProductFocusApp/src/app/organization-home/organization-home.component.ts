import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { ToastrService } from 'ngx-toastr';
import {
  IAddOrganizationInput,
  IAddProductInOrganizationInput,
  IProduct,
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
    private authService: MsalService,
    private toastr: ToastrService
  ) { }
  active: boolean = false;
  organizationAddView: boolean = false;
  productAddView: boolean = false;
  organizationName: string | undefined;
  selectedOrganization: any;
  productName: string | undefined;
  organizationList: any = [];
  productList: IProduct[] = [];
  organizationSpinner = false;
  productSpinner = false;
  enabledAdding: boolean = true;
  ngOnInit(): void {
    this.setOrganizationList();
  }
  setOrganizationList() {
    this.organizationSpinner = true;
    this.organizationService.getOrganizationListByUser().subscribe(
      (res) => {
        this.organizationSpinner = false;
        this.organizationList = res;
        if(this.organizationList.length >= 1)
          this.selectOrganization(this.organizationList[0]);
        if (this.selectedOrganization !== undefined)
          this.setProductList(this.selectedOrganization.id);
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
        this.toastr.success("Organization added.","Success");
        this.organizationAddView = false;
        this.organizationName = '';
        this.setOrganizationList();
        this.enabledAdding = true;
      },
      (err) => {
        this.toastr.error("Organization not added","Failed");
        this.enabledAdding = true;
      }
    );
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
  selectOrganization(organization: any) {
    this.selectedOrganization = organization;
    localStorage.lastSelctedOrganizationId = this.selectedOrganization.id;
    localStorage.selectedOrganization = JSON.stringify(this.selectedOrganization);
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
}
