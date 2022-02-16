import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../dht-common/models';
import { AddProductDocumentation, ProductDocumentation, ProductDocumentationDetails, TopParentDetails, TreeContainer } from './model';
import { ProductDocumentationSharedService } from './_services/product-documentation-shared.service';
import { ProductDocumentationService } from './_services/product-documentation.service';

@Component({
  selector: 'app-product-documentation',
  templateUrl: './product-documentation.component.html',
  styleUrls: ['./product-documentation.component.scss'],
  providers: [ProductDocumentationSharedService]
})
export class ProductDocumentationComponent implements OnInit {
  productDocumentations!: ProductDocumentation;
  productDocumentationsDetails: ProductDocumentationDetails[] = [];
  selectedProduct!: IProduct;
  addParentDocumentationId: number | null | undefined = null;

  productDocumentation: AddProductDocumentation = new AddProductDocumentation(null, -1, '','');
  constructor(private productDocumentationService: ProductDocumentationService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(!selectedProductString) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.productDocumentation.productId = this.selectedProduct.id;
    this.productDocumentationService.getProductDocumentations(this.selectedProduct.id).subscribe(x => {
      this.productDocumentations = {title: 'root', childDocumentations: x} as ProductDocumentation;
      if(x.length !== 0) {
        this.getFlatProductDocumentations(x[0].id, 1, x[0].id);
      }
    });
  }

  onDocumentationSelect(event: TreeContainer) {
    this.getFlatProductDocumentations(event.topParent.id, event.index, event.current.id);
  }

  private getFlatProductDocumentations(documentationId: number, index: number, currentDocumentationId: number) {
    this.productDocumentationService.getProductDocumentationDetails(documentationId, index).subscribe(x => {
      this.productDocumentationsDetails = x;
      setTimeout(() => this.scroll(currentDocumentationId));
    });
  }

  scroll(position: number) {
    console.log(position);
    document.getElementById(position.toString())!.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  // addDocumentationBelow(event: {topParentDetails: TopParentDetails, parentDocumentationId: number | null | undefined}) {
  //   this.addParentDocumentationId = event.parentDocumentationId;
  //   if(event.parentDocumentationId !== undefined) {
  //     this.productDocumentation.parentId = event.parentDocumentationId;
  //   }
  //   this.onDocumentationSelect(event.topParentDetails);
  // }

  addDocumentationBelow(event: TreeContainer) {
    this.addParentDocumentationId = event.parent.id;
    if(event.parent.id !== undefined) {
      this.productDocumentation.parentId = event.parent.id;
    }
    this.productDocumentationService.getProductDocumentationDetails(event.topParent.id, event.index).subscribe(x => {
      this.productDocumentationsDetails = x;
      setTimeout(() => this.scroll(event.current.id));
    });
  }

  addProductDocumentation() {
    this.productDocumentationService.addProductDocumentation(this.productDocumentation).subscribe(x => {
      this.toastr.success('Documentation added.', 'Success');
    }, err => {
      this.toastr.error(err.error, 'Failed');
    })
  }

  cancelAdding() {
    this.productDocumentation = new AddProductDocumentation(null, this.selectedProduct.id, '', '');
    this.addParentDocumentationId = null;
  //   this.productDocShared.changeMode(false);
  }

}
