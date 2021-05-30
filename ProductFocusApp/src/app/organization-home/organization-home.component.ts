import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AddOrganizationInput, AddProductInOrganizationInput } from '../dht-common/models';
import { OrganizationService } from '../_services/organization.service';

@Component({
  selector: 'app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.css']
})
export class OrganizationHomeComponent implements OnInit {

  constructor(private organizationService: OrganizationService,
              private authService: MsalService) { }
  active: boolean = false;
  organizationAddView: boolean = false;
  productAddView: boolean = false;
  organizationName: string | undefined;
  selectedOrganization: any;
  productName: string | undefined;
  organizationList: any = [];
  productList: any = [];
  organizationSpinner = false;
  productSpinner = false;
  enabledAdding: boolean = true;
  ngOnInit(): void {
    this.setOrganizationList();
  }
  setOrganizationList(){
    this.organizationSpinner = true
    this.organizationService.getOrganizationListByUser().subscribe(res => {
      this.organizationSpinner = false;
      this.organizationList = res;
      this.selectedOrganization = this.organizationList[0];
      if(this.selectedOrganization != undefined)
        this.setProductList(this.selectedOrganization.id);
    },err=>{
      this.organizationSpinner = false;
    })
  }
  addOrganization(){
    if(this.organizationName === undefined || this.organizationName == ''){
      return;
    }
    this.enabledAdding = false;
    var addOrganizationInput: AddOrganizationInput = {
      organizationName: this.organizationName,
      email: this.authService.instance.getAllAccounts()[0].username
    }
    this.organizationService.addOrganization(addOrganizationInput).subscribe(res => {
      // success
      this.organizationAddView = false;
      this.organizationName = '';
      this.setOrganizationList();
      this.enabledAdding = true;
    },err=> {
      alert(err);
      this.enabledAdding = true;
    })
  }
  setProductList(id: number){
    this.productSpinner = true;
    this.productList = [];
    this.organizationService.getProductsByOrganizationId(id).subscribe(res => {
      this.productSpinner = false;
      this.productList = res;
      console.log(res);
    },err => {
      console.log(err);
    })
  }
  selectOrganization(organization: any){
    this.selectedOrganization = organization;
  }
  addProduct(){
    if(this.productName === undefined || this.productName == ''){
      return;
    }
    if(this.selectedOrganization == undefined)
      return;
    this.enabledAdding = false;
    var addProductInOrganizationInput: AddProductInOrganizationInput = {
      name: this.productName
    }
    this.organizationService.addProductInOrganization(
      this.selectedOrganization.id,
      addProductInOrganizationInput).subscribe(res =>{
        this.productName = '';
        this.productAddView = false;
        this.enabledAdding = true;
        if(this.selectedOrganization != undefined)
          this.setProductList(this.selectedOrganization.id);
      },err=>{
        alert(err);
        this.enabledAdding = true;
      })
  }
  setLastProductId(id: number){
    localStorage.setItem('productId',id.toString());
  }
}