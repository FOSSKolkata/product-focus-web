import { Component, OnInit } from '@angular/core';
import { AddOrganizationInput, AddProductInOrganizationInput } from '../kanban-board/models';
import { OrganizationService } from '../_services/organization.service';

@Component({
  selector: 'app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.css']
})
export class OrganizationHomeComponent implements OnInit {

  constructor(private organizationService: OrganizationService) { }
  active: boolean = false;
  organizationAddView: boolean = false;
  productAddView: boolean = false;
  organizationName: string | undefined;
  selectedOrganizationId: number| undefined;
  productName: string | undefined;
  organizationList: any = [];
  productList: any = [];
  ngOnInit(): void {
    this.setOrganizationList();
  }
  setOrganizationList(){
    this.organizationService.getOrganizationList().subscribe(res => {
      this.organizationList = res;
      this.selectedOrganizationId = this.organizationList[0].id;
      if(this.selectedOrganizationId != undefined)
        this.setProductList(this.selectedOrganizationId);
    })
  }
  addOrganization(){
    if(this.organizationName === undefined || this.organizationName == ''){
      return;
    }
    var addOrganizationInput: AddOrganizationInput = {
      name: this.organizationName
    }
    this.organizationService.addOrganization(addOrganizationInput).subscribe(res => {
      // success
      this.organizationAddView = false;
      this.organizationName = '';
      this.setOrganizationList();
    },err=> {
      alert(err);
    })
  }
  setProductList(id: number){
    this.organizationService.getProductsByOrganizationId(id).subscribe(res => {
      this.productList = res;
      console.log(res);
    },err => {
      console.log(err);
    })
  }
  selectOrganization(id: number){
    this.selectedOrganizationId = id;
  }
  addProduct(){
    if(this.productName === undefined || this.productName == ''){
      return;
    }
    if(this.selectedOrganizationId == undefined)
      return;
    var addProductInOrganizationInput: AddProductInOrganizationInput = {
      name: this.productName
    }
    this.organizationService.addProductInOrganization(
      this.selectedOrganizationId,
      addProductInOrganizationInput).subscribe(res =>{
        this.productName = '';
        this.productAddView = false;
        if(this.selectedOrganizationId != undefined)
          this.setProductList(this.selectedOrganizationId);
      },err=>{
        console.log(err);
      })
  }
  setLastProductId(id: number){
    localStorage.setItem('productId',id.toString());
  }
}