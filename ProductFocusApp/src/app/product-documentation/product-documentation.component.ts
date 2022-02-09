import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from '../dht-common/models';
import { ProductDocumentation, ProductDocumentationDetails, TopParentDetails } from './model';
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
  constructor(private productDocService: ProductDocumentationService,
    private router: Router) { }

  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(!selectedProductString) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.productDocService.getProductDocumentations(this.selectedProduct.id).subscribe(x => {
      this.productDocumentations = {title: 'root', childDocumentations: x} as ProductDocumentation;
      if(x.length !== 0) {
        this.getFlatProductDocumentations(x[0].id, 1);
      }
    });
  }

  onDocumentationSelect(topDocumentation: TopParentDetails) {
    this.getFlatProductDocumentations(topDocumentation.details.id, topDocumentation.index);
  }

  getFlatProductDocumentations(documentationId: number, index: number) {
    this.productDocService.getProductDocumentationDetails(documentationId, index).subscribe(x => {
      this.productDocumentationsDetails = x;
      console.log(this.productDocumentationsDetails);
    });
  }

  scroll(position: number) {
    document.getElementById(position + '')!.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

}
