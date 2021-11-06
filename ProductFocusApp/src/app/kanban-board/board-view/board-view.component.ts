import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { FeatureOrdering, FeatureStatus, GroupCategory, IKanbanBoard, IModule, ISprint, ModifyColumnIdentifier, OrderingCategoryEnum, OrderingInfo } from 'src/app/dht-common/models';
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
  kanbanBoardSpinner: boolean = true;
  kanbanBoard: IKanbanBoard[] = [];
  board: any = [];
  boardWithoutFilter: any = [];
  selectedProduct!: {id: number, name: string};
  error!: HttpErrorResponse;
  eventsSubscription!: Subscription;
  @Input('selected-group') selectedGroup = GroupCategory.Module;
  modules: IModule[] = [];
  addFeatureModuleId = -1;

  constructor(private featureService: FeatureService,
    private router: Router,
    private productService: ProductService,
    private toStr: ToastrService) { }
  
  async ngOnInit(): Promise<void> {
    let selectedProductJSONString = localStorage.getItem('selectedProduct');
    if(!selectedProductJSONString) {
      this.router.navigate(["/"]);
    }
    this.selectedProduct = JSON.parse(selectedProductJSONString?selectedProductJSONString:'');
    
    this.productService.getModulesByProductId(this.selectedProduct.id).subscribe(x => {
      this.modules = x;
    });
    
    while(!this.selectedSprint) {
      await new Promise(resolve => setTimeout(resolve,100));
    }
    if(this.events) {
      this.eventsSubscription = this.events.subscribe(() => {
        setTimeout(()=> {
          this.setKanbanBoard();
        },0);
      });
    }
    this.setKanbanBoard();
  }

  setKanbanBoard() {
    if (this.selectedProduct === undefined) {
      this.router.navigate(['/']);
    }
    if(!this.selectedSprint) {
      this.router.navigate(['/']);
      return;
    }
    this.productService
      .getKanbanViewByProductIdAndQuery(this.selectedProduct.id,
        OrderingCategoryEnum.BoardView,
        this.selectedSprint.id,
        this.selectedUserIds,
        this.selectedGroup)
      .subscribe((x) => {
        this.kanbanBoard = x;
        this.kanbanBoardSpinner = false;
        this.board = this.setBoard(this.kanbanBoard);
      },(err)=>{
        this.kanbanBoardSpinner = false;
        this.error = err;
      });
    this.productService.getKanbanViewByProductIdAndQuery(this.selectedProduct.id,
      OrderingCategoryEnum.BoardView,
      this.selectedSprint.id,
      [], this.selectedGroup).subscribe(x => {
        this.kanbanBoardWithoutFilter = x;
        this.boardWithoutFilter = this.setBoard(this.kanbanBoardWithoutFilter);
      })
  }

  setBoard(kBoard: IKanbanBoard[]): any[] {
    let board : any[] = [];
    for (let module of kBoard) {
      board.push([]);
      board[board.length - 1].groupName = module.groupName;
      for (let feature of module.featureDetails) {
        if (board[board.length - 1].length == 0) {
          for (let i = 0; i < 4; i++) {
            board[board.length - 1].push([]);
          }
        }
        board[board.length - 1][feature.status].push(feature);
      }
    }
    for(let row of board) {
      for(let column of row){
        column.sort((item1: any, item2: any) => {
          if(item1.orderNumber < item2.orderNumber)
            return -1;
          return 1;
        });
      }
    }
    return board;
  }

  findModuleIndex(moduleName: string): number {
    for(let moduleIndex = 0; moduleIndex < this.boardWithoutFilter.length; moduleIndex++) {
      if(moduleName === this.boardWithoutFilter[moduleIndex].groupName) {
        return moduleIndex;
      }
    }
    throw "module not found.";
  }

  selectModuleOnAddFeature(event: any | number) {
    if(typeof event === 'number') {
      this.addFeatureModuleId = event;
    }else {
      this.addFeatureModuleId = event.target.value;
    }
  }

  getCardPlacedPosition(modulePosition: number): {row: number, column: number} {
    let placedPosition = {row: 0, column: 0};
    for(let column = 0; column < 4; column++) {
      let filteredCardRowIndex = 0, withoutFilterCardRowIndex = 0;
      let numberOfFilteredCard = this.board[modulePosition][column].length;
      let numberOfWithoutFilterCard = this.boardWithoutFilter[modulePosition][column].length;
      while(filteredCardRowIndex < numberOfFilteredCard) {
        if(withoutFilterCardRowIndex == numberOfWithoutFilterCard) {
          placedPosition.row = filteredCardRowIndex;
          placedPosition.column = column;
          break;
        }
        if(this.board[modulePosition][column][filteredCardRowIndex].id === this.boardWithoutFilter[modulePosition][column][withoutFilterCardRowIndex].id) {
          filteredCardRowIndex++;
        }
        withoutFilterCardRowIndex++;
      }
    }
    return placedPosition;
  }

  reorderBoard(modulePosition: number) {
    let orderInfo: FeatureOrdering[] = [];
    let map = new Map<number,number>() // Store card id and order number after reordering
    let counter = 0;
    // Reordering in which card is moved.
    for(let column = 0; column < 4; column++) {
      for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
          let card = this.boardWithoutFilter[modulePosition][column][row];
        orderInfo.push({featureId: card.id, orderNumber:  ++counter});
        map.set(card.id, counter);
        card.orderNumber = counter;
      }
    }

    // Reordering other module's card
    for(let moduleIndex = 0; moduleIndex <  this.boardWithoutFilter.length; moduleIndex++) {
      if(moduleIndex != modulePosition) {
        for(let column = 0; column < 4; column++) {
          if(this.boardWithoutFilter[moduleIndex][column] === undefined) {
            break;
          }
          for(let row = 0; row < this.boardWithoutFilter[moduleIndex][column].length; row++) {
            let card = this.boardWithoutFilter[moduleIndex][column][row];
            orderInfo.push({featureId: card.id, orderNumber:  ++counter});
            map.set(card.id, counter);
            card.orderNumber = counter;
          }
        }
      }
    }

    // set filtered board order
    for(let moduleIndex = 0; moduleIndex < this.board.length; moduleIndex++) {
      if(moduleIndex != modulePosition) {
        for(let column = 0; column < 4; column++) {
          if(this.boardWithoutFilter[moduleIndex][column] === undefined) {
            break;
          }
          for(let row = 0; row < this.board[moduleIndex][column].length; row++) {
              let card = this.board[moduleIndex][column][row];
              card.orderNumber = map.get(card.id);
          }
        }
      }
    }
    
    let orderingInfo : OrderingInfo = {
      sprintId: this.selectedSprint?this.selectedSprint.id:-1,
      featuresOrdering: orderInfo,
      orderingCategory: OrderingCategoryEnum.BoardView
    };

    this.featureService.modifyFeatureOrder(orderingInfo).subscribe(res => {

    }, err => {
      this.toStr.error('Unable to update.',err.error);
    });
  }

  updateKanbanBoardOrdering(moduleName: string, movedCardId: number, previousToCardPlacedCardId: number) {
    let modulePosition = this.findModuleIndex(moduleName);
    let placedPosition = this.getCardPlacedPosition(modulePosition);
    
    let movedCardCopy : any;
    for(let column = 0; column < 4; column++) {
      for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
        if(this.boardWithoutFilter[modulePosition][column][row].id == movedCardId) {
          movedCardCopy = JSON.parse(JSON.stringify(this.boardWithoutFilter[modulePosition][column][row]));
          this.boardWithoutFilter[modulePosition][column][row].id = -1; // Will be deleted
          break;
        }
      }
    }

    if(previousToCardPlacedCardId === -1) { // If the card is placed at the top
      this.boardWithoutFilter[modulePosition][placedPosition.column].splice(0, 0, movedCardCopy);
    }
    else {
      for(let column = 0; column < 4; column++) {
        for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
          if(this.boardWithoutFilter[modulePosition][column][row].id === previousToCardPlacedCardId) {
            this.boardWithoutFilter[modulePosition][column].splice(row + 1, 0, movedCardCopy); // Placed the card next to previous card
            break;
          }
        }
      }
    }

    for(let column = 0; column < 4; column++) {
      for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
        if(this.boardWithoutFilter[modulePosition][column][row].id === -1) {
          this.boardWithoutFilter[modulePosition][column].splice(row,1); // Remove the card
          break;
        }
      }
    }
    this.reorderBoard(modulePosition);
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

    let previousToCardPlacedCardId = event.currentIndex === 0 ? -1 : event.container.data[event.currentIndex-1].id;
    let moduleName = event.container.id;
    let placedCardId = event.container.data[event.currentIndex].id;

    // Iterate on every features where featureElement is dropped

    let isStatusChanging = false;
    for (let feature of event.container.data) {
      if (feature.status != status) {
        // Since the status of element where it is dropped is not equal to the status of that column
        isStatusChanging = true;
        feature.status = status;
        this.featureService
          .modifyFeatureElement({
            id: feature.id,
            status: status,
            fieldName: ModifyColumnIdentifier.status,
          })
          .subscribe((x) => {
            this.updateKanbanBoardOrdering(moduleName, placedCardId , previousToCardPlacedCardId);
          });
        break;
      }
    }
    if(!isStatusChanging) {
      this.updateKanbanBoardOrdering(moduleName, placedCardId , previousToCardPlacedCardId);
    }
  }
 
  public get featureStatus(): typeof FeatureStatus {
    return FeatureStatus;
  }

  public get groupCategoryEnum(): typeof GroupCategory {
    return GroupCategory;
  }
  
  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
}