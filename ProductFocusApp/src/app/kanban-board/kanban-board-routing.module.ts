import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FocusComponent } from './focus/focus.component';
import { KanbanBoardComponent } from './kanban-board.component';

const routes: Routes = [
  {
    path: '',
    component: KanbanBoardComponent,
    data: {breadcrumb: 'Kanban Board'}
  },{
    path: 'focus',
    component: FocusComponent,
    data: {breadcrumb: 'Focus'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductModulesRoutingModule {}
