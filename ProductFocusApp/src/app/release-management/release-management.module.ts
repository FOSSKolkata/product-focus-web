import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleaseManagementRoutingModule } from './release-management-routing.module';
import { ReleasesComponent } from './releases/releases.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { ReleaseDetailsComponent } from './release-details/release-details.component';

@NgModule({
  declarations: [
    ReleasesComponent,
    ReleaseDetailsComponent
  ],
  imports: [
    CommonModule,
    ReleaseManagementRoutingModule,
    MatProgressBarModule,
    FormsModule
  ]
})
export class ReleaseManagementModule { }
