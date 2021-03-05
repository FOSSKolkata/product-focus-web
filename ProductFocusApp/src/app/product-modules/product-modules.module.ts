import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature/feature.component';
import { ModuleComponent } from './module/module.component';
import { ProductModulesComponent } from './product-modules.component';
import { ProductModulesRoutingModule } from './product-modules-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProductModulesRoutingModule
  ],
  declarations: [
    ProductModulesComponent,
    FeatureComponent,
    ModuleComponent
  ]
})

export class ProductModulesModule {
  constructor(){
    console.log("ProductModules Module loaded.");
  }
}
