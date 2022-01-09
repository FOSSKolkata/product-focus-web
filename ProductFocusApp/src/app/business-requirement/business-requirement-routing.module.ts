import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessRequirementDetailsComponent } from './business-requirement-details/business-requirement-details.component';
import { BusinessRequirementComponent } from './business-requirement.component';

const routes: Routes = [
  {
    path: '',
    data: {breadcrumb: {skip: true}},
    children: [
      {
        path: '',
        redirectTo: 'business-requirement-list'
      },{
        path: 'business-requirement-list',
        component: BusinessRequirementComponent,
        data: {breadcrumb: 'Business Requirement List'},
      },{
        path: 'business-requirement-list',
        data: {breadcrumb: 'Business Requirement List'},
        children: [
          {
            path: 'business-requirement-details',
            component: BusinessRequirementDetailsComponent,
            data: {breadcrumb: 'Business Requirement Details'}
          },{
              path: 'business-requirement-details/:businessRequirementId',
              component: BusinessRequirementDetailsComponent,
              data: {breadcrumb: 'Business Requirement Details'}
          }
        ]
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRequirementRoutingModule { }
