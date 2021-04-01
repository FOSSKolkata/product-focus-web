import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoadmapComponent } from './product-roadmap.component';
import { ProductRoadmapRoutingModule } from './product-roadmap-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule } from 'angular-resizable-element';
import { TestDragComponent } from './test-drag/test-drag.component';

@NgModule({
  declarations: [ProductRoadmapComponent,TestDragComponent],
  imports: [
    CommonModule,
    ProductRoadmapRoutingModule,
    NgbModule,
    ResizableModule
  ]
})
export class ProductRoadmapModule { }
