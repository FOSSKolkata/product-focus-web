import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoadmapComponent } from './product-roadmap.component';
import { ProductRoadmapRoutingModule } from './product-roadmap-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ProductRoadmapComponent],
  imports: [
    CommonModule,
    ProductRoadmapRoutingModule,
    NgbModule
  ]
})
export class ProductRoadmapModule { }
