import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { OrganizationHomeComponent } from './organization-home/organization-home.component';
import { OrganizationMembersComponent } from './organization-members/organization-members.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },{
    path: 'product-modules',
    loadChildren: ()=> import('./product-modules/product-modules.module').then(m => m.ProductModulesModule),
    canActivate: [
      MsalGuard,
    ]
  },{
    path: 'news-report',
    loadChildren: ()=> import('./news-report/news-report.module').then(m => m.NewsReportModule),
    canActivate: [
      MsalGuard,
    ]
  },{
    path: 'product-roadmap',
    loadChildren: ()=> import('./product-roadmap/product-roadmap.module').then(m =>m.ProductRoadmapModule),
    canActivate: [
      MsalGuard,
    ]
  },{
    path: 'organization-home',
    component: OrganizationHomeComponent
  },{
    path: 'organization-members',
    component: OrganizationMembersComponent
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
