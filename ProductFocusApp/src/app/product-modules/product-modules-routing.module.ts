import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductModulesComponent } from "./product-modules.component";

const routes: Routes = [
{
    path: 'product-modules',
    component: ProductModulesComponent,
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProductModulesRoutingModule{

}