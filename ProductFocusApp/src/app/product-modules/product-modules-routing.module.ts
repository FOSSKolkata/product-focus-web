import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./manage/manage.component";
import { ProductModulesComponent } from "./product-modules.component";

const routes: Routes = [
  {
    path: 'product-modules',
    component: ProductModulesComponent,
  },{
    path: 'product-modules/manage',
    component: ManageComponent
  }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProductModulesRoutingModule{

}