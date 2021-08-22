import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board.component';

const routes: Routes = [
  {
    path: 'kanban-board',
    component: KanbanBoardComponent,
    data: {breadcrumb: {alias: 'kanbanboard'}}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductModulesRoutingModule {}
