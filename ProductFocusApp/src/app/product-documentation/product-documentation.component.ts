import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddProductDocumentation, ProductDocumentation, ProductDocumentationDetails, TreeContainer } from './model';
import { ProductDocumentationService } from './_services/product-documentation.service';

@Component({
  selector: 'app-product-documentation',
  templateUrl: './product-documentation.component.html',
  styleUrls: ['./product-documentation.component.scss']
})
export class ProductDocumentationComponent implements OnInit {
  productId: number;
  productDocumentations!: ProductDocumentation;
  productDocumentationsDetails: ProductDocumentationDetails[] = [];
  addParentDocumentationId?: number | null = null;
  addingDocumentation = false;
  previouslyTopLevelSelectedDocumentation!: ProductDocumentation;
  loadingIndex = false;
  loadingDocumentation = false;
  noDocumentationStep = 0;
  editable = false;

  productDocumentation: AddProductDocumentation;
  constructor(private productDocumentationService: ProductDocumentationService,
    private toastr: ToastrService,
    private route: ActivatedRoute) {
      this.productId = this.route.snapshot.params['id'];
      this.productDocumentation = new AddProductDocumentation(null, this.productId, '','');
    }

  ngOnInit(): void {
    this.loadProductDocumentation(null);
  }

  changeMode() {
    this.editable = !this.editable;
  }

  loadProductDocumentation(documentationId: number | null) {
    this.loadingIndex = true;
    this.productDocumentationService.getProductDocumentations(this.productId).subscribe(x => {
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

  addProductDocumentation(form: NgForm) {
    this.productDocumentationService.addProductDocumentation(this.productDocumentation).subscribe(x => {
      form.reset();
      this.toastr.success('Documentation added.', 'Success');
      this.loadProductDocumentation(this.previouslyTopLevelSelectedDocumentation?.id??null);
      this.cancelAdding();
    }, err => {
      this.toastr.error(err.error, 'Failed');
    })
  }

  cancelAdding() {
    this.productDocumentation = new AddProductDocumentation(null, this.productId, '', '');
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
