import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessRequirementRoutingModule } from './business-requirement-routing.module';
import { BusinessRequirementComponent } from './business-requirement.component';
import { BusinessRequirementDetailsComponent } from './business-requirement-details/business-requirement-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DragDropFileUploadDirective } from './_directives/drag-drop-file-upload.directive';
import { DhtCommonModule } from '../dht-common/dht-common.module';


@NgModule({
  declarations: [
    BusinessRequirementComponent,
    BusinessRequirementDetailsComponent,
    DragDropFileUploadDirective
  ],
  imports: [
    CommonModule,
    DhtCommonModule,
    BusinessRequirementRoutingModule,
    NgbModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
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
    })
  ]
})
export class BusinessRequirementModule { }
