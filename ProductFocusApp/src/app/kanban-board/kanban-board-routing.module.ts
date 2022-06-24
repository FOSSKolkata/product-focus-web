import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board.component';

const routes: Routes = [
  {
    path: '',
    component: KanbanBoardComponent,
    data: {breadcrumb: 'Kanban Board'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductModulesRoutingModule {}
