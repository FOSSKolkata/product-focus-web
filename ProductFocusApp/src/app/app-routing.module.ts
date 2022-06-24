import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizationHomeComponent } from './organization-home/organization-home.component';
import { OrganizationComponent } from './organization/organization.component';
import { LayoutComponent } from './layout/layout.component';
import { MsalGuard } from '@azure/msal-angular';
import { RediectComponent } from './rediect/rediect.component';
import { InvitationComponent } from './invitation/invitation.component';
import { OrganizationMembersComponent } from './organization/organization-members/organization-members.component';
import { ErrorComponent } from './dht-common/error/error.component';
import { CodeComponent } from './garbage/code/code.component';
import { InvitationsComponent } from './organization/invitations/invitations.component';
import { SecureGuard } from './guard/secure.guard';
import { TemporaryRouterComponent } from './garbage/temporary-router/temporary-router.component';
import { ReleaseDetailsComponent } from './garbage/release-management/release-details/release-details.component';
import { RegressionTestComponent } from './garbage/test-management/regression-test/regression-test.component';
import { ProductivityReportComponent } from './garbage/productivity-report/productivity-report.component';
import { ProductRoadmapComponent } from './garbage/product-roadmap/product-roadmap.component';
import { TestReportDetailsComponent } from './garbage/test-management/test-report-details/test-report-details.component';
import { TestReportListComponent } from './garbage/test-management/test-report-list/test-report-list.component';

const layoutRoutes: Routes = [
  {
    path: 'products/:id/kanban-board',
    loadChildren: () =>
      import('./kanban-board/kanban-board.module').then(
        (m) => m.KanbanBoardModule
      ),
  },{
    path: 'product-roadmap',
    loadChildren: () =>
      import('./product-roadmap/product-roadmap.module').then(
        (m) => m.ProductRoadmapModule
      ),
  },{
    path: 'products/:id/news-report',
    loadChildren: () =>
      import('./news-report/news-report.module').then(
        (m) => m.NewsReportModule
      ),
  }
  ,{
    path: 'products/:id/tag-management',
    loadChildren: () => 
      import('./tag-management/tag-management.module').then(
        (m) => m.TagManagementModule
      )
  },{
    path: 'products/:id/business-requirement',
    loadChildren: () =>
      import('./business-requirement/business-requirement.module').then(
        m => m.BusinessRequirementModule
      )
  },{
    path: 'products/:id/product-documentation',
    loadChildren: () =>
      import('./product-documentation/product-documentation.module').then(
        (m) => m.ProductDocumentationModule
      )
  },{
    path: 'products/:id/test-management',
    loadChildren: () =>
      import('./test-management/test-management.module').then(
        (m) => m.TestManagementModule
      ),
    data: {breadcrumb: {skip: true}}
  },{
    path: 'products/:id/release-management',
    loadChildren: () =>
      import('./release-management/release-management.module').then(
        m => m.ReleaseManagementModule
      ),
    data: {breadcrumb: {skip: true}}
  },{
    path: '',
    component: TemporaryRouterComponent,
    children: [
      // {
      //   path: 'product-documentation',
      //   component: ProductDocumentationComponent,
      //   data: {breadcrumb: 'Product Documentation'}
      // },
      // {
      //   path: 'work-item-based-tests',
      //   component: TestManagementComponent,
      //   data: {breadcrumb: 'Work Item Based Tests'}
      // },{
      //   path: 'release-management',
      //   component: ReleaseManagementComponent,
      //   data: {breadcrumb: 'Release Management'},
      // },
      {
          path: 'release-details',
          component: ReleaseDetailsComponent,
          data: {breadcrumb: 'Release Details'}
      },{
        path: 'regression-tests',
        component: RegressionTestComponent,
        data: {breadcrumb: 'Regression Tests'}
      },{
        path: 'productivity-report',
        component: ProductivityReportComponent,
        data: {breadcrumb: 'Productivity Report'}
      },{
        path: 'pipeline-report',
        component: ProductRoadmapComponent,
        data: {breadcrumb: 'Pipeline Report'}
      },{
        path: 'test-report-details',
        component: TestReportDetailsComponent,
        data: {breadcrumb: 'Test Report Details'}
      },{
        path: 'test-report-list',
        component: TestReportListComponent,
        data: {breadcumb: 'Test Report List'}
      }
    ],
    data: {breadcrumb: {skip: true}}
  }
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'organizations',
    pathMatch: 'full'
  },{
    path: 'id_token',
    redirectTo: 'organizations',
    pathMatch: 'full'
  },{
    path: 'home',
    component: HomeComponent,
    data: {breadcrumb: {skip: true}}
  },{
    path: 'organizations',
    canActivate: [MsalGuard,SecureGuard],
    data: {breadcrumb: {skip: true}},
    children: [
      {
        path: '',
        component: OrganizationHomeComponent,
        data: {breadcrumb: (resolvedId: string) => `${resolvedId}`, skip: true},
      },{
        path: ':organizationName',
        data: {breadcrumb: {label: (resolvedId: string) => `${resolvedId}`}},
        children:[
          {
            path: '',
            component: OrganizationHomeComponent
          },{
            path: '',
            component: LayoutComponent,
            canActivate: [MsalGuard,SecureGuard],
            children: layoutRoutes,
            runGuardsAndResolvers: 'always'
          },
        ],
      }
    ],
  },{
    path: 'organization',
    component: OrganizationComponent,
    canActivate: [MsalGuard,SecureGuard],
    data: {breadcrumb: 'Organization'},
    children: [
      {
        path: '',
        redirectTo: 'members',
        pathMatch: 'full',
      },{
        path: 'members',
        component: OrganizationMembersComponent,
        data: {breadcrumb: 'Members'}
      },{
        path: 'invitations',
        component: InvitationsComponent,
        data: {breadcrumb: 'Invitations'}
      },
    ],
  },{
    path: 'invitation',
    component: InvitationComponent,
    canActivate: [MsalGuard,SecureGuard],
    data: {breadcrumb: {skip: true}}
  },{
    path: 'error',
    component: ErrorComponent,
    data: {breadcrumb: {skip: true}}
  },{
    path: 'state',
    component: RediectComponent,
    data: {breadcrumb: {skip: true}}
  },{
    path: 'code',
    component: CodeComponent,
    data: {breadcrumb: {skip: true}}
  },{
    path: '**',
    component: ErrorComponent,
    data: {breadcrumb: {skip: true}}
  }
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      // Don't perform initial navigation in iframes
      initialNavigation: !isIframe ? 'enabled' : 'disabled'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
