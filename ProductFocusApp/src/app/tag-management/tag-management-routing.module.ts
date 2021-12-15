import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTagCategoryComponent } from './add-tag-category/add-tag-category.component';
import { AddTagComponent } from './add-tag/add-tag.component';
import { TagManagementComponent } from './tag-management.component';

const routes: Routes = [
  {
    path: 'tag-management',
    component: TagManagementComponent,
    data: {breadcrumb: 'Tag Management'},
    children: [
      {
        path: '',
        redirectTo: 'add-tag'
      },{
        path: 'add-tag',
        component: AddTagComponent,
        data: {breadcrumb: 'Add Tag'}
      },{
        path: 'add-tag-category',
        component: AddTagCategoryComponent,
        data: {breadcrumb: 'Add Tag Category'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagManagementRoutingModule { }
