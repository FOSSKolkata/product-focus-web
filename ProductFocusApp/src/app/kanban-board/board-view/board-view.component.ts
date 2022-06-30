import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { FeatureOrdering, FeatureStatus, GroupCategory, IKanban, IModule, ISprint, ModifyColumnIdentifier, OrderingInfo } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})

export class BoardViewComponent implements OnInit, OnDestroy {
  @Input('selected-sprint') selectedSprint: ISprint | null = null;
  @Input('selected-userids')selectedUserIds = [];
  @Input() events: Observable<void> | undefined;
  @Input('kanban-board-spinner') kanbanBoardSpinner: boolean = true;
  kanban!: IKanban;
  kanbanWithoutFilter!: IKanban;
  board: any = [];
  boardWithoutFilter: any = [];
  productId: number;
  error!: HttpErrorResponse;
  eventsSubscription!: Subscription;
  @Input('selected-group') selectedGroup = GroupCategory.Module;
  modules: IModule[] = [];

  constructor(private featureService: FeatureService,
    private router: Router,
    private productService: ProductService,
    private toStr: ToastrService,
    private route: ActivatedRoute) {
      this.productId = this.route.snapshot.params['id'];
    }
  
  async ngOnInit(): Promise<void> {
    this.setModules();
    
    if(this.events) {
      this.eventsSubscription = this.events.subscribe(() => {
        setTimeout(()=> {
          this.setKanbanBoard();
        },0);
      });
    }
    this.setKanbanBoard();
  }

  setModules() {
    this.productService.getModulesByProductId(this.productId).subscribe(x => {
      this.modules = x;
    });
  }

  setKanbanBoard() {
    this.setModules();
    this.productService
      .getKanbanViewByProductIdAndQuery(this.productId,
        this.selectedSprint?.id,
        this.selectedUserIds,
        this.selectedGroup)
      .subscribe((x) => {
        this.kanban = x;
        this.kanbanBoardSpinner = false;
        this.board = this.setBoard(this.kanban);
      },(err)=>{
        this.kanbanBoardSpinner = false;
        this.error = err;
      });
    this.productService.getKanbanViewByProductIdAndQuery(this.productId,
      this.selectedSprint?.id, [],
      GroupCategory.Module).subscribe(x => {
        this.kanbanWithoutFilter = x;
        this.boardWithoutFilter = this.setBoard(this.kanbanWithoutFilter);
      })
  }

  setBoard(kBoard: IKanban): any[] {
    let board : any[] = [];
    for (let module of kBoard.kanbanList) {
      board.push([]);
      for(let i = 0; i < 5; i++) {
        board[board.length - 1].push([]);
      }
      board[board.length - 1].groupList = [];
      for(let groupItem of module.groupList) {
        board[board.length - 1].groupList.push({groupName: groupItem.groupName});
      }
      for (let feature of module.featureDetails) {
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

  getCardPlacedPosition(modulePosition: number): {row: number, column: number} {
    let placedPosition = {row: 0, column: 0};
    for(let column = 0; column < 5; column++) {
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
    // Reordering module's in which card is moved.
    // for(let column = 0; column < 5; column++) {
    //   for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
    //     let card = this.boardWithoutFilter[modulePosition][column][row];
    //     orderInfo.push({featureId: card.id, orderNumber:  ++counter});
    //     map.set(card.id, counter);
    //     card.orderNumber = counter;
    //   }
    // }

    // Reordering other module's card
    for(let moduleIndex = 0; moduleIndex <  this.boardWithoutFilter.length; moduleIndex++) {
      // if(moduleIndex != modulePosition) {
        for(let column = 0; column < 5; column++) {
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
      // }
    }
    

    // set filtered board order
    for(let moduleIndex = 0; moduleIndex < this.board.length; moduleIndex++) {
      // if(moduleIndex != modulePosition) {
        for(let column = 0; column < 5; column++) {
          if(this.board[moduleIndex][column] === undefined) {
            break;
          }
          for(let row = 0; row < this.board[moduleIndex][column].length; row++) {
              let card = this.board[moduleIndex][column][row];
              card.orderNumber = map.get(card.id);
          }
        }
      // }
    }

    
    let orderingInfo : OrderingInfo = {
      sprintId: this.selectedSprint?this.selectedSprint.id:-1,
      featuresOrdering: orderInfo
    };

    this.featureService.modifyFeatureOrder(orderingInfo).subscribe(res => {

    }, err => {
      this.toStr.error('Unable to update.',err.error);
    });
  }

  updateKanbanBoardOrdering(modulePosition: number, movedCardId: number, previousToCardPlacedCardId: number) {
    let placedPosition = this.getCardPlacedPosition(modulePosition);
    let movedCardCopy : any;
    for(let column = 0; column < 5; column++) {
      for(let modulePosition = 0; modulePosition < this.boardWithoutFilter.length; modulePosition++) {
        for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
          if(this.boardWithoutFilter[modulePosition][column][row].id === movedCardId) {
            movedCardCopy = JSON.parse(JSON.stringify(this.boardWithoutFilter[modulePosition][column][row]));
            this.boardWithoutFilter[modulePosition][column][row].id = -1; // Will be deleted
            break;
          }
        }
      }
    }

    if(previousToCardPlacedCardId === -1 && this.kanban.groupType === 'Module') { // If the card is placed at the top
      this.boardWithoutFilter[modulePosition][placedPosition.column].splice(0, 0, movedCardCopy);
    }
    else {
      for(let column = 0; column < 5; column++) {
        for(let modulePosition = 0; modulePosition < this.boardWithoutFilter.length; modulePosition++) {
          for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
            if(this.boardWithoutFilter[modulePosition][column][row].id === previousToCardPlacedCardId) {
              this.boardWithoutFilter[modulePosition][column].splice(row + 1, 0, movedCardCopy); // Placed the card next to previous card
              break;
            }
          }
        }
      }
    }

    for(let column = 0; column < 5; column++) {
      for(let modulePosition = 0; modulePosition < this.boardWithoutFilter.length; modulePosition++) {
        for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
          if(this.boardWithoutFilter[modulePosition][column][row].id === -1) {
            this.boardWithoutFilter[modulePosition][column].splice(row,1); // Remove the card
            break;
          }
        }
      }
    }
    this.reorderBoard(modulePosition);
  }

  getUserIdsInUserGroup(index: number) {
    let userIds = [];
    for(let user of this.kanban.kanbanList[index].groupList) {
      if(user.groupId !== null)
        userIds.push(user.groupId);
    }
    return userIds;
  }

  async drop(event: CdkDragDrop<any[]>, status: FeatureStatus) {
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
    if(this.kanban.groupType === 'Users') {
      let excludeOwnerList = [];
      for(let owner of event.container.data[event.currentIndex].assignees) {
        excludeOwnerList.push(owner.userId);
      }
      let object = {
        id: event.container.data[event.currentIndex].id,
        fieldName: ModifyColumnIdentifier.includeExcludeOwners,
        includeOwnerList: this.getUserIdsInUserGroup(+event.container.id),
        excludeOwnerList: excludeOwnerList
      }
      await this.featureService.modifyFeatureElement(object).toPromise().then();
    }
    let previousToCardPlacedCardId = event.currentIndex === 0 ? -1 : event.container.data[event.currentIndex-1].id;
    let modulePosition = +event.container.id;
    let placedCardId = event.container.data[event.currentIndex].id;
    
    if(event.previousContainer.id != event.container.id && this.kanban.groupType === 'Module') {
      let movedCardCopy;
      let position = this.getCardPlacedPosition(modulePosition);
      for(let column = 0; column < 5; column++) {
        for(let row = 0; row < this.boardWithoutFilter[+event.previousContainer.id][column].length; row++) {
          if(this.boardWithoutFilter[+event.previousContainer.id][column][row].id == placedCardId) {
            movedCardCopy = JSON.parse(JSON.stringify(this.boardWithoutFilter[+event.previousContainer.id][column][row]));
            this.boardWithoutFilter[+event.previousContainer.id][column].splice(row,1);
            break;
          }
        }
      }
      if(previousToCardPlacedCardId === -1) { // If the card is placed at the top
        this.boardWithoutFilter[modulePosition][position.column].splice(0, 0, movedCardCopy);
      }
      else {
        for(let column = 0; column < 5; column++) {
          for(let row = 0; row < this.boardWithoutFilter[modulePosition][column].length; row++) {
            if(this.boardWithoutFilter[modulePosition][column][row].id === previousToCardPlacedCardId) {
              this.boardWithoutFilter[modulePosition][column].splice(row + 1, 0, movedCardCopy); // Placed the card next to previous card
              break;
            }
          }
        }
      }
      let cardDroppedInModule = null;
      for(let module of this.modules) {
        if(module.name === this.boardWithoutFilter[+event.container.id].groupList[0].groupName) {
          cardDroppedInModule = module;
          break;
        }
      }

      let orderInfo: FeatureOrdering[] = [];
      let map = new Map<number,number>() // Store card id and order number after reordering
      let counter = 0;
      for(let moduleIndex = 0; moduleIndex < this.boardWithoutFilter.length; moduleIndex++) {
        for(let column = 0; column < 5; column++) {
          if(this.boardWithoutFilter[moduleIndex][column] === undefined) {
            break;
          }
          for(let row = 0; row < this.boardWithoutFilter[moduleIndex][column].length; row++) {
            let card = this.boardWithoutFilter[moduleIndex][column][row];
            orderInfo.push({featureId: card.id, orderNumber:  ++counter});
            map.set(card.id, counter);
            card.orderNumber = counter;
            if(card.id === placedCardId) {
              card.moduleId = cardDroppedInModule?.id;
            }
          }
        }
      }
      for(let moduleIndex = 0; moduleIndex <  this.board.length; moduleIndex++) {
        for(let column = 0; column < 5; column++) {
          if(this.board[moduleIndex][column] === undefined) {
            break;
          }
          for(let row = 0; row < this.board[moduleIndex][column].length; row++) {
            let card = this.board[moduleIndex][column][row];
            card.orderNumber = map.get(card.id);
            if(card.id === placedCardId) {
              card.moduleId = cardDroppedInModule?.id;
            }
          }
        }
      }
      let orderingInfo : OrderingInfo = {
        sprintId: this.selectedSprint?this.selectedSprint.id:-1,
        featuresOrdering: orderInfo
      };
  
      let object: any = {
        id: placedCardId,
        fieldName: ModifyColumnIdentifier.updateModule,
        moduleId: cardDroppedInModule?.id
      };

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
              this.featureService.modifyFeatureElement(object).subscribe((x) => {
                this.featureService.modifyFeatureOrder(orderingInfo).subscribe(res => {
          
                }, err => {
                  this.toStr.error('Unable to update.',err.error);
                });
              },(err)=>{
                this.toStr.error('Update is not saved!!',err.error);
              });
            });
          break;
        }
      }
      if(!isStatusChanging) {
        this.featureService.modifyFeatureElement(object).subscribe((x) => {
          this.featureService.modifyFeatureOrder(orderingInfo).subscribe(res => {
    
          }, err => {
            this.toStr.error('Unable to update.',err.error);
          });
        },(err)=>{
          this.toStr.error('Update is not saved!!',err.error)
        });
      }
      
    } else {

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
              this.updateKanbanBoardOrdering(modulePosition, placedCardId , previousToCardPlacedCardId);
            });
          break;
        }
      }
      if(!isStatusChanging) {
        this.updateKanbanBoardOrdering(modulePosition, placedCardId , previousToCardPlacedCardId);
      }
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