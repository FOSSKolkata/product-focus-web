import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyWorkingArea } from './my-working-area/my-working-area.component';
import { KanbanBoardComponent } from './kanban-board.component';

const routes: Routes = [
  {
    path: '',
    component: KanbanBoardComponent,
    data: {breadcrumb: 'Kanban Board'}
  },{
    path: 'myworkingarea',
    component: MyWorkingArea,
    data: {breadcrumb: 'My Working Area'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductModulesRoutingModule {}
