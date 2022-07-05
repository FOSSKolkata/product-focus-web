import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleaseManagementRoutingModule } from './release-management-routing.module';
import { ReleasesComponent } from './releases/releases.component';
import { FormsModule } from '@angular/forms';
import { ReleaseDetailsComponent } from './release-details/release-details.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ReleasesComponent,
    ReleaseDetailsComponent
  ],
  imports: [
    CommonModule,
    ReleaseManagementRoutingModule,
    FormsModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule
  ]
})
export class ReleaseManagementModule { }
