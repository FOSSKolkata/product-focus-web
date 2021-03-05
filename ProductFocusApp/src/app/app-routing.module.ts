import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { ProductModulesModule } from './product-modules/product-modules.module';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },{
    path: 'product-modules',
    component: ProfileComponent,
    loadChildren: ()=> import('./product-modules/product-modules.module').then(c => c.ProductModulesModule),
    canActivate: [
      MsalGuard,
    ]
  },
  {
    // Needed for hash routing
    path: 'error',
    component: HomeComponent
  },
  {
    // Needed for hash routing
    path: 'state',
    component: HomeComponent
  },
  {
    // Needed for hash routing
    path: 'code',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent
  },{
    path: '**',
    component: ProductModulesModule
  }
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    // Don't perform initial navigation in iframes
    initialNavigation: !isIframe ? 'enabled' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(){
    console.log("AppRouting module is loaded.");
  }
}
