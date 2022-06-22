import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReleaseDetailsComponent } from './release-details/release-details.component';
import { ReleasesComponent } from './releases/releases.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'releases',
    data: {breadcrumb: {skip: true}}
  },{
    path: 'releases',
    component: ReleasesComponent,
    data: {breadcrumb: 'Releases'}
  },{
    path: 'releases',
    children: [
      {
        path: ':id/details',
        component: ReleaseDetailsComponent,
        data: {breadcrumb: 'Enter the release name dynamically'}
      }
    ],
    data: {breadcrumb: 'Releases'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReleaseManagementRoutingModule { }
