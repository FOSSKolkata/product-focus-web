import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductRoadmapComponent } from './product-roadmap.component';

const routes: Routes = [
  {
    path: 'product-roadmap',
    component: ProductRoadmapComponent,
    data: {breadcrumb: 'Roadmap'}
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoadmapRoutingModule {}
