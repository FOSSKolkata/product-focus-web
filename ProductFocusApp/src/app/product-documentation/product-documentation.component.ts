import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../dht-common/models';
import { AddProductDocumentation, ProductDocumentation, ProductDocumentationDetails, TreeContainer } from './model';
import { ProductDocumentationService } from './_services/product-documentation.service';

@Component({
  selector: 'app-product-documentation',
  templateUrl: './product-documentation.component.html',
  styleUrls: ['./product-documentation.component.scss']
})
export class ProductDocumentationComponent implements OnInit {
  productDocumentations!: ProductDocumentation;
  productDocumentationsDetails: ProductDocumentationDetails[] = [];
  selectedProduct!: IProduct;
  addParentDocumentationId: number | null | undefined = null;
  addingDocumentation = false;
  previouslyTopLevelSelectedDocumentation!: ProductDocumentation;
  loadingIndex = false;
  loadingDocumentation = false;
  noDocumentationStep = 0;

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
    this.loadProductDocumentation(null);
  }

  loadProductDocumentation(documentationId: number | null) {
    this.loadingIndex = true;
    this.productDocumentationService.getProductDocumentations(this.selectedProduct.id).subscribe(x => {
      this.loadingIndex = false;
      this.productDocumentations = {title: 'root', childDocumentations: x} as ProductDocumentation;
      if(x.length !== 0) {
        if(documentationId === null) {
          this.getFlatProductDocumentations(x[0].id, 1, x[0].id);
        }
        else {
          this.getFlatProductDocumentations(documentationId, 1, documentationId);
        }
      }
    }, err => {
      this.toastr.error(err.error, 'Failed');
      this.loadingIndex = false;
    });
  }

  onDocumentationSelect(event: TreeContainer) {
    this.getFlatProductDocumentations(event.topParent.id, event.index, event.current.id);
  }

  private getFlatProductDocumentations(documentationId: number, index: number, currentDocumentationId: number) {
    this.loadingDocumentation = true;
    this.productDocumentationService.getProductDocumentationDetails(documentationId, index).subscribe(x => {
      this.productDocumentationsDetails = x;
      this.loadingDocumentation = false;
      setTimeout(() => this.scroll(currentDocumentationId));
    }, err => {
      this.toastr.error(err.error, 'Failed');
      this.loadingDocumentation = false;
    });
  }

  scroll(position: number) {
    document.getElementById(position.toString())!.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  addDocumentationBelow(event: TreeContainer) {
    this.previouslyTopLevelSelectedDocumentation = event.topParent;
    this.addParentDocumentationId = event.parent.id;
    if(event.parent.id !== undefined) {
      this.productDocumentation.parentId = event.parent.id;
    }
    this.loadingDocumentation = true;
    this.productDocumentationService.getProductDocumentationDetails(event.topParent.id, event.index).subscribe(x => {
      this.loadingDocumentation = false;
      this.productDocumentationsDetails = x;
      setTimeout(() => this.scroll(event.current.id));
    }, err => {
      this.toastr.error(err.error, 'Failed');
      this.loadingDocumentation = false;
    });
  }

  addProductDocumentation() {
    this.productDocumentationService.addProductDocumentation(this.productDocumentation).subscribe(x => {
      this.toastr.success('Documentation added.', 'Success');
      console.log(this.previouslyTopLevelSelectedDocumentation, 'prev');
      this.loadProductDocumentation(this.previouslyTopLevelSelectedDocumentation?.id??null);
      this.cancelAdding();
    }, err => {
      this.toastr.error(err.error, 'Failed');
    })
  }

  cancelAdding() {
    this.productDocumentation = new AddProductDocumentation(null, this.selectedProduct.id, '', '');
    this.addParentDocumentationId = null;
  }

  changeNoDocumentationStep(step: number) {
    this.noDocumentationStep = step;
  }

  // Updating changes index page
  onDocumentationChanged(event: ProductDocumentationDetails) {
    const queue : ProductDocumentation[] =  [];
    queue.push(this.productDocumentations);
    while(queue.length !== 0) {
      const top : ProductDocumentation | undefined = queue.shift();
      if(top?.id === event.id) {
        top.title = event.title
        return;
      }
      for(let documentation of top?.childDocumentations??[]) {
        queue.push(documentation);
      }
    }
  }

}