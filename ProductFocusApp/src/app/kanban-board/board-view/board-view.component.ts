import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FeatureStatus, IKanbanBoard, ISprint, ModifyColumnIdentifier, OrderingCategoryEnum, OrderingInfo } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})
export class BoardViewComponent implements OnInit, OnDestroy {
  @Input('kanban-board-without-filter') kanbanBoardWithoutFilter: IKanbanBoard[] = [];
  @Input('selected-sprint') selectedSprint: ISprint | null = null;
  @Input('selected-userids')selectedUserIds = [];
  @Input() events: Observable<void> | undefined;
  kanbanBoardSpinner: boolean = false;
  kanbanBoard: IKanbanBoard[] = [];
  board: any = [];
  boardWithoutFilter: any = [];
  selectedProduct!: {id: number, name: string};
  error!: HttpErrorResponse;
  eventsSubscription!: Subscription;

  constructor(private featureService: FeatureService,
    private router: Router,
    private productService: ProductService) { }
  
  async ngOnInit(): Promise<void> {
    let selectedProductJSONString = localStorage.getItem('selectedProduct');
    if(!selectedProductJSONString) {
      this.router.navigate(["/"]);
    }
    this.selectedProduct = JSON.parse(selectedProductJSONString?selectedProductJSONString:'');
    while(!this.selectedSprint) {
      await new Promise(resolve => setTimeout(resolve,100));
    }
    if(this.events)
      this.eventsSubscription = this.events.subscribe(() => {
        setTimeout(()=> {
          this.setKanbanBoard();
        },0);
      });
    this.setKanbanBoard();
  }

  setKanbanBoard() {
    if (this.selectedProduct === undefined) {
      this.router.navigate(['/']);
    }
    if(!this.selectedSprint)
      return
    this.kanbanBoardSpinner = true;
    this.productService
      .getKanbanViewByProductIdAndQuery(this.selectedProduct.id,
        OrderingCategoryEnum.BoardView,
        this.selectedSprint.id,
        this.selectedUserIds)
      .subscribe((x) => {
        this.kanbanBoard = x;
        this.kanbanBoardSpinner = false;
        this.setBoard();
      },(err)=>{
        this.kanbanBoardSpinner = false;
        this.error = err;
      });
  }

  setBoard(): void {
    this.board = [];
    for (var module of this.kanbanBoard) {
      this.board.push([]);
      this.board[this.board.length - 1].name = module.name;
      this.board[this.board.length - 1].id = module.id;
      for (var feature of module.featureDetails) {
        if (this.board[this.board.length - 1].length == 0) {
          for (var i = 0; i < 4; i++) {
            this.board[this.board.length - 1].push([]);
          }
        }
        this.board[this.board.length - 1][feature.status].push(feature);
      }
    }
    for(var row of this.board) {
      for(var column of row){
        column.sort((item1: any, item2: any) => {
          if(item1.orderNumber < item2.orderNumber)
            return -1;
          return 1;
        });
      }
    }
  }

  drop(event: CdkDragDrop<any[]>, status: FeatureStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateOrder(event.container.data[0].moduleId);
    
    // Iterate on every features where featureElement is dropped
    for (let feature of event.container.data) {
      if (feature.status != status) {
        // Since the status of element where it is dropped is not equal to the status of that column
        feature.status = status;
        this.featureService
          .modifyFeatureElement({
            id: feature.id,
            status: status,
            fieldName: ModifyColumnIdentifier.status,
          })
          .subscribe((x) => {
            
          });
      }
    }
  }

  updateOrder(moduleId: number) {
    //This will work only without filter.
    let maps = new Array(4);
    let orders: OrderingInfo = {
      orderingCategory : OrderingCategoryEnum.BoardView,
      featuresOrder: [],
      sprintId: this.selectedSprint?this.selectedSprint.id:-1
    }

    for(let i=0;i<4;i++) {
      maps[i] = new Array();
    }
    
    for(let module of this.board) {
      if(module.id == moduleId) {
        for(let i=0;i<4;i++){
          if(module[i] === undefined)
            continue;
          for(let feature of module[i]) {
            maps[feature.status].push(feature.id)
          }
        }
      }
    }
    let counter = 0;
    for(let map of maps) {
      for(let id of map){
        orders.featuresOrder.push({featureId: id, orderNumber: ++counter});
      }
    }
    console.log(maps);
    this.featureService.modifyFeatureOrder(orders).subscribe(x => {

    });
  }
   
  public get featureStatus(): typeof FeatureStatus {
    return FeatureStatus;
  }
  
  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
}