import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from './tree-node/tree-node.component';
import { ProductDocumentationComponent } from './product-documentation.component';
import { ProductDocumentationRoutingModule } from './product-documentation-routing.module';
import { DhtCommonModule } from '../dht-common/dht-common.module';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ProductDocumentationDetailsComponent } from './product-documentation-details/product-documentation-details.component';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [TreeNodeComponent, ProductDocumentationComponent, ProductDocumentationDetailsComponent],
  imports: [
    CommonModule,
    DhtCommonModule,
    ProductDocumentationRoutingModule,
    FormsModule,
    NgbModalModule,
    NgbDropdownModule,
    MatSlideToggleModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
      
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
      
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],
      
          ['clean'],                                         // remove formatting button
      
          ['link', 'image', 'video']                         // link and image, video
        ]
      }
    }),
  ]
})
export class ProductDocumentationModule { }
