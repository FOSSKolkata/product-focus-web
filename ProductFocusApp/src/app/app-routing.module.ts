import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizationHomeComponent } from './organization-home/organization-home.component';
import { OrganizationComponent } from './organization/organization.component';
import { LayoutComponent } from './layout/layout.component';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './profile/profile.component';
import { RediectComponent } from './rediect/rediect.component';
import { InvitationComponent } from './invitation/invitation.component';
import { OrganizationMembersComponent } from './organization/organization-members/organization-members.component';
import { ErrorComponent } from './garbage/error/error.component';
import { CodeComponent } from './garbage/code/code.component';
import { InvitationsComponent } from './organization/invitations/invitations.component';
import { DailyScrumComponent } from './daily-scrum/daily-scrum.component';

const SECURE_APP_ROUTES: Routes = [
  {
    path: 'products/:id',
    loadChildren: () =>
      import('./kanban-board/kanban-board.module').then(
        (m) => m.KanbanBoardModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./product-roadmap/product-roadmap.module').then(
        (m) => m.ProductRoadmapModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./news-report/news-report.module').then(
        (m) => m.NewsReportModule
      ),
  },{
    path: 'scrum',
    component: DailyScrumComponent
  }
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'organizations',
    pathMatch: 'full'
  },
  {
    path: 'id_token',
    redirectTo: 'organizations',
    pathMatch: 'full',
    data: {breadcrumb: 'Organizations'}
  },{
    path: '',
    component: LayoutComponent,
    canActivate: [MsalGuard],
    children: SECURE_APP_ROUTES,
    runGuardsAndResolvers: 'always',
  },{
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'organizations',
    component: OrganizationHomeComponent,
    canActivate: [MsalGuard],
    data: {breadcrumb: 'Organization Home'}
  },{
    path: 'organizations/:organization-name',
    component: OrganizationHomeComponent,
    canActivate: [MsalGuard],
    data: {breadcrumb: ' '}
  },{
    path: 'organization',
    component: OrganizationComponent,
    data: {breadcrumb: 'Organization'},
    children: [
      {
        path: '',
        redirectTo: 'members',
        pathMatch: 'full',
      },
      {
        path: 'members',
        component: OrganizationMembersComponent,
        data: {breadcrumb: 'Members'}
      },
      {
        path: 'invitations',
        component: InvitationsComponent,
        data: {breadcrumb: 'Invitations'}
      },
    ],
    canActivate: [MsalGuard],
  },
  {
    path: 'invitation',
    component: InvitationComponent,
    canActivate: [MsalGuard],
    data: {breadcrumb: 'Invitation'}
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {breadcrumb: 'Profile'}
  },
  {
    // Needed for hash routing
    path: 'error',
    component: ErrorComponent,
  },
  {
    // Needed for hash routing
    path: 'state',
    component: RediectComponent,
  },
  {
    // Needed for hash routing
    path: 'code',
    component: CodeComponent,
  },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      // Don't perform initial navigation in iframes
      initialNavigation: !isIframe ? 'enabled' : 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor() {
    console.log('AppRouting module is loaded.');
  }
}
