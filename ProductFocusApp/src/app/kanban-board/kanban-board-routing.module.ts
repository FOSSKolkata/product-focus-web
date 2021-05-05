import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./manage/manage.component";
import { KanbanBoardComponent } from "./kanban-board.component";

const routes: Routes = [
  {
    path: 'kanban-board',
    component: KanbanBoardComponent,
  },{
    path: 'kanban-board/manage',
    component: ManageComponent
  }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProductModulesRoutingModule{

}