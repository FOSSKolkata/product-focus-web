import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { ToastrService } from 'ngx-toastr';
import { IAddProductInOrganizationInput, IProduct } from 'src/app/dht-common/models';
import { OrganizationService } from 'src/app/_services/organization.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productSpinner = false;
  productList: IProduct[] = [];
  productName: string | undefined;
  selectedOrganization: any;
  enabledAdding: boolean = true;
  productAddView: boolean = false;
  organizationSpinner= false;
  constructor(private organizationService: OrganizationService,
    private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private router: Router) { 
      this.router.events.subscribe((isOrganizationChanged) => {
        if(isOrganizationChanged instanceof NavigationEnd){
          this.selectedOrganization = JSON.parse(localStorage.selectedOrganization);
          this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.selectedOrganization.name);
          this.setProductList(this.selectedOrganization.id);
        }
      });
    }

  ngOnInit(): void {
    this.selectedOrganization = JSON.parse(localStorage.selectedOrganization);
    this.setProductList(this.selectedOrganization.id);
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
