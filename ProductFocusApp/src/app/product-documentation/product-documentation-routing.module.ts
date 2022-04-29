import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDocumentationComponent } from './product-documentation.component';

const routes: Routes = [
  {
    path: '',
    component: ProductDocumentationComponent,
    data: {breadcrumb: 'Product Documentation'}
  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)]
})
export class ProductDocumentationRoutingModule { }
