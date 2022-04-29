import { Component, OnInit, Input, AfterContentInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Quill from 'quill';
import { IProduct } from 'src/app/dht-common/models';
import { ProductDocumentationDetails, UpdateDocumentationFieldName } from '../model';
import { ProductDocumentationService } from '../_services/product-documentation.service';

@Component({
  selector: 'app-product-documentation-details',
  templateUrl: './product-documentation-details.component.html',
  styleUrls: ['./product-documentation-details.component.scss']
})
export class ProductDocumentationDetailsComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input('details') productDocumentationDetails!: ProductDocumentationDetails;
  oldTopic!: string;
  oldDescription!: string;
  @Input('isEditMode') isEditMode = false;
  @Output('changed') changed = new EventEmitter<ProductDocumentationDetails>();
  editor!: Quill;
  enabledAdding = true;
  selectedProduct!: IProduct;
  @Input('editable') editable = true;

  constructor(private modalService: NgbModal,
    private productDocumentationService: ProductDocumentationService,
    private toastr: ToastrService) { }
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
  }

  ngAfterContentInit () {
    this.oldTopic = this.productDocumentationDetails.title;
    this.oldDescription = this.productDocumentationDetails.description;
  }

  registerEditor(qull: Quill){
    this.editor = qull;
  }

  doFocus() {
    if(!this.editable) {
      return;
    }
    this.isEditMode = true;
    setTimeout(() => this.editor.focus());
  }

  discardChanges() {
    this.productDocumentationDetails.description = this.oldDescription;
    this.editor.blur();
  }

  doBlur(content: any) {
    this.isEditMode = false;
    if(this.oldDescription !== this.productDocumentationDetails.description) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', centered: true, backdrop: 'static' }).result.then((result) => {
        if(result.toLowerCase() === 'save click') {
          this.modifyDocumentation(this.productDocumentationDetails, this.productDocumentationDetails.description, UpdateDocumentationFieldName.Description);
        } else if(result.toLowerCase() === 'discard click') {
          this.discardChanges();
        }
      }, (reason) => {

      });
    }
  }

  modifyDocumentation(documentation: ProductDocumentationDetails, fieldData: string, fieldName: UpdateDocumentationFieldName) {
    let object: any = { };
    object.id = documentation.id;

    if(fieldName === UpdateDocumentationFieldName.Title) {
      object.title = fieldData;
      object.fieldName = UpdateDocumentationFieldName.Title;
    }

    if(fieldName === UpdateDocumentationFieldName.Description) {
      object.description = fieldData;
      object.fieldName = UpdateDocumentationFieldName.Description;
    }
    this.productDocumentationService.updateProductDocumentation(object).subscribe(x => {
      this.toastr.success('Documentation Updated', 'success');
      if(fieldName === UpdateDocumentationFieldName.Title) {
        this.oldTopic = this.productDocumentationDetails.title;
      } else if(fieldName === UpdateDocumentationFieldName.Description) {
        this.oldDescription = this.productDocumentationDetails.description;
      }
      this.changed.emit(this.productDocumentationDetails);
    }, err => {
      this.toastr.error(err.error, 'Failed');
    });
  }

  max(...values: number[]) : number {
    return Math.max(...values);
  }

  get updateDocumentationFieldName(): typeof UpdateDocumentationFieldName {
    return UpdateDocumentationFieldName;
  }

}
