import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagManagementRoutingModule } from './tag-management-routing.module';
import { TagManagementComponent } from './tag-management.component';
import { AddTagComponent } from './add-tag/add-tag.component';
import { AddTagCategoryComponent } from './add-tag-category/add-tag-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [TagManagementComponent, AddTagComponent, AddTagCategoryComponent],
  imports: [
    CommonModule,
    TagManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule
  ]
})
export class TagManagementModule { }
