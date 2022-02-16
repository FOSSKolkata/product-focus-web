import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Quill from 'quill';
import { IProduct } from 'src/app/dht-common/models';
import { ProductDocumentationDetails } from '../model';

@Component({
  selector: 'app-product-documentation-details',
  templateUrl: './product-documentation-details.component.html',
  styleUrls: ['./product-documentation-details.component.scss']
})
export class ProductDocumentationDetailsComponent implements OnInit, AfterContentInit {

  @Input('details') productDocumentationDetails!: ProductDocumentationDetails;
  oldDescription!: string;
  @Input('isEditMode') isEditMode = false;
  editor!: Quill;
  enabledAdding = true;
  selectedProduct!: IProduct;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  ngAfterContentInit () {
    this.oldDescription = this.productDocumentationDetails.description;
  }

  registerEditor(qull: Quill){
    this.editor = qull;
  }

  doFocus() {
    this.isEditMode = true;
    setTimeout(() => this.editor.focus());
  }

  saveDocumentation() {
    this.modalService.dismissAll();
  }

  doBlur(content: any) {
    this.isEditMode = false;
    if(this.oldDescription !== this.productDocumentationDetails.description) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', centered: true, backdrop: 'static' }).result.then((result) => {
        
      }, (reason) => {

      });
    }
  }

  max(...values: number[]) : number {
    return Math.max(...values);
  }

}
