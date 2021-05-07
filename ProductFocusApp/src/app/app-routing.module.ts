import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizationHomeComponent } from './organization-home/organization-home.component';
import { OrganizationMembersComponent } from './organization-members/organization-members.component';
import { LayoutComponent } from './layout/layout.component';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './profile/profile.component';
import { RediectComponent } from './rediect/rediect.component';
import { InvitationComponent } from './invitation/invitation.component';

const SECURE_APP_ROUTES: Routes = [
  {
    path: 'products/:id',
    loadChildren: ()=> import('./kanban-board/kanban-board.module').then(m => m.KanbanBoardModule)
  },{
    path: '',
    loadChildren: ()=> import('./product-roadmap/product-roadmap.module').then(m => m.ProductRoadmapModule)
  },{
    path: '',
    loadChildren: ()=> import('./news-report/news-report.module').then(m => m.NewsReportModule)
  },{
    path: 'profile',
    component: ProfileComponent
  }
]

const routes: Routes = [
  {
    path: '',
    component: OrganizationHomeComponent,
    canActivate: [MsalGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [MsalGuard],
    children: SECURE_APP_ROUTES, runGuardsAndResolvers: 'always',
  },{
    path: 'home',
    component: HomeComponent
  },{
    path: 'organization-home',
    component: OrganizationHomeComponent,
    canActivate: [MsalGuard]
  },{
    path: 'organization-members',
    component: OrganizationMembersComponent,
    canActivate: [MsalGuard]
  },{
    path: 'invitation',
    component: InvitationComponent,
    canActivate: [MsalGuard]
  }
  ,{
    // Needed for hash routing
    path: 'error',
    component: RediectComponent
  },{
    // Needed for hash routing
    path: 'state',
    component: RediectComponent
  },{
    // Needed for hash routing
    path: 'code',
    component: RediectComponent
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
