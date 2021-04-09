import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoadmapComponent } from './product-roadmap.component';
import { ProductRoadmapRoutingModule } from './product-roadmap-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResizableModule } from 'angular-resizable-element';
import { DragComponent } from './drag/drag.component';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  declarations: [ProductRoadmapComponent,DragComponent],
  imports: [
    CommonModule,
    ProductRoadmapRoutingModule,
    NgbModule,
    ResizableModule,
    AngularDraggableModule
  ]
})
export class ProductRoadmapModule { }
