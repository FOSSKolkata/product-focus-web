import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature/feature.component';
import { ModuleComponent } from './module/module.component';
import { ProductModulesComponent } from './product-modules.component';
import { ProductModulesRoutingModule } from './product-modules-routing.module';
import { FeatureDetailsComponent } from './feature-details/feature-details.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ManageComponent } from './manage/manage.component';

@NgModule({
  imports: [
    CommonModule,
    ProductModulesRoutingModule,
    FormsModule,
    NgbModule,
    DragDropModule
  ],
  declarations: [
    ProductModulesComponent,
    FeatureComponent,
    ModuleComponent,
    FeatureDetailsComponent,
    ManageComponent
  ]
})

export class ProductModulesModule {
  constructor(){
    console.log("ProductModules Module loaded.");
  }
}
