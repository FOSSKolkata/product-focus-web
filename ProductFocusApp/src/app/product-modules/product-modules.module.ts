import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature/feature.component';
import { ModuleComponent } from './module/module.component';
import { ProductModulesComponent } from './product-modules.component';
import { ProductModulesRoutingModule } from './product-modules-routing.module';
import { FeatureDetailsComponent } from './feature-details/feature-details.component';

@NgModule({
  imports: [
    CommonModule,
    ProductModulesRoutingModule
  ],
  declarations: [
    ProductModulesComponent,
    FeatureComponent,
    ModuleComponent,
    FeatureDetailsComponent
  ]
})

export class ProductModulesModule {
  constructor(){
    console.log("ProductModules Module loaded.");
  }
}
