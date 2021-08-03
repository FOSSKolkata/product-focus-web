import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FeatureComponent } from './feature/feature.component';
import { KanbanBoardComponent } from './kanban-board.component';
import { ProductModulesRoutingModule } from './kanban-board-routing.module';
import { FeatureDetailsComponent } from './feature-details/feature-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DhtCommonModule } from '../dht-common/dht-common.module';
import { AddUserComponent } from './add-user/add-user.component';
import { AddFeatureComponent } from './add-feature/add-feature.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { UserListComponent } from './user-list/user-list.component'
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BoardViewComponent } from './board-view/board-view.component';
import { ScrumViewComponent } from './scrum-view/scrum-view.component';
import { ProgressCommentComponent } from './scrum-view/progress-comment/progress-comment.component';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    ProductModulesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DragDropModule,
    AutocompleteLibModule,
    DhtCommonModule,
    MatSelectModule,
    MatSliderModule,
    MatRadioModule,
    MdePopoverModule,
    MatCardModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  declarations: [
    KanbanBoardComponent,
    FeatureComponent,
    FeatureDetailsComponent,
    AddUserComponent,
    AddFeatureComponent,
    UserListComponent,
    BoardViewComponent,
    ScrumViewComponent,
    ProgressCommentComponent,
  ],
  providers: [
    DatePipe
  ]
})
export class KanbanBoardModule {
  constructor() {
    console.log('ProductModules Module loaded.');
  }
}
