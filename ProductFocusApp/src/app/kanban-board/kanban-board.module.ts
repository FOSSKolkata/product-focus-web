import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureComponent } from './feature/feature.component';
import { ModuleComponent } from './module/module.component';
import { KanbanBoardComponent } from './kanban-board.component';
import { ProductModulesRoutingModule } from './kanban-board-routing.module';
import { FeatureDetailsComponent } from './feature-details/feature-details.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ManageComponent } from './manage/manage.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CommonComponentsModule } from '../common-components/common-components.module';

@NgModule({
  imports: [
    CommonModule,
    ProductModulesRoutingModule,
    FormsModule,
    NgbModule,
    DragDropModule,
    AutocompleteLibModule,
    CommonComponentsModule
  ],
  declarations: [
    KanbanBoardComponent,
    FeatureComponent,
    ModuleComponent,
    FeatureDetailsComponent,
    ManageComponent
  ]
})

export class KanbanBoardModule {
  constructor(){
    console.log("ProductModules Module loaded.");
  }
}
