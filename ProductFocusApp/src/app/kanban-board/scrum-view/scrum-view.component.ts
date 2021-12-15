import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { FeatureOrdering, GroupCategory, IFeatureDetails, IKanban, IMemberDetail, IModule, IScrumDay, ISprint, ModifyColumnIdentifier, OrderingInfo } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';
import { ProductService } from 'src/app/_services/product.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-scrum-view',
  templateUrl: './scrum-view.component.html',
  styleUrls: ['./scrum-view.component.scss']
})
export class ScrumViewComponent implements OnInit, OnDestroy {
  @Input('selected-sprint') currentSprint: ISprint | null = null;
  @Input('is-loading')kanbanBoardSpinner: boolean = false;
  @Input('selected-userids') selectedUserIds = [];
  @Input() events: Observable<void> | undefined;

  kanban!: IKanban;
  kanbanWithoutFilter!: IKanban;
  // kanbanBoard: IKanbanBoard[] = [];
  // kanbanBoardWithoutFilter: IKanbanBoard[] = [];
  sprintDates: Date[] = [];
  board:any[] = [];
  boardWithoutFilter: any[] = [];
  organizationUser: IMemberDetail[] = [];
  organization: any | null = null;
  selectedProduct!: {id: number, name: string};
  featureOrder = new Map<number,number>();
  eventsSubscription!: Subscription;
  error!: HttpErrorResponse;
  modules: IModule[] = [];
  @Input('selected-group') selectedGroupCategory = GroupCategory.Module;
  
  constructor(private featureService: FeatureService,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private productService: ProductService) { }

  sortByDateAndAddExtra(scrumDays: IScrumDay[]) {
    let scrumDaysMap = new Map<number,IScrumDay>();
    let modifiedScrumDays: IScrumDay[] = [];
    for(let curr of scrumDays){
      scrumDaysMap.set(new Date(curr.date).getTime(),curr);
    }
    for(let curr of this.sprintDates){
      let currScrumDay = scrumDaysMap.get(new Date(curr).getTime());
      if(currScrumDay === undefined){
        modifiedScrumDays.push({
          comment: null,
          date: new Date(curr),
          featureId: -1,
          workCompletionPercentage: null
        });
      }
      else{
        modifiedScrumDays.push(currScrumDay);
      }
    }
    return modifiedScrumDays;
  }

  async ngOnInit(): Promise<void> {
    let selectedProductJSONString = localStorage.getItem('selectedProduct');
    if(!selectedProductJSONString) {
      this.router.navigate(["/"]);
    }
    this.selectedProduct = JSON.parse(selectedProductJSONString?selectedProductJSONString:'');
    this.organization = JSON.parse(localStorage.selectedOrganization);
    if(this.organization === undefined || this.organization === null){
      this.router.navigate(['/']);
    }
    this.userService.getUserListByOrganization(this.organization.id).subscribe(x=>{
      this.organizationUser = x.members;
    });

    this.productService.getModulesByProductId(this.selectedProduct.id).subscribe(x => {
      this.modules = x;
    });
    
    if(this.events) {
      this.eventsSubscription = this.events.subscribe(() => {
        setTimeout(()=> {
          this.setKanbanBoard();
        },0);
      });
    }
    
    // while(!this.currentSprint) {
    //   await new Promise(resolve => setTimeout(resolve,100));
    // }
    this.setKanbanBoard();
  }
  setKanbanBoard() {
    if (this.selectedProduct === undefined) {
      this.router.navigate(['/']);
    }
    if(!this.currentSprint)
      return
    this.kanbanBoardSpinner = true;
    this.productService
      .getKanbanViewByProductIdAndQuery(this.selectedProduct.id, this.currentSprint.id, this.selectedUserIds, this.selectedGroupCategory)
      .subscribe((x) => {
        this.kanban = x;
        // this.kanbanBoard = x.kanbanList;
        // for(let module of this.kanbanBoard) {
        //   module.featureDetails.sort((item1: IFeatureDetails, item2: IFeatureDetails) => {
        //     if(item1.orderNumber < item2.orderNumber)
        //       return -1;
        //     if(item1.orderNumber > item2.orderNumber)
        //       return 1;
        //     return 0;
        //   });
        // }
        for(let module of this.kanban.kanbanList) {
          module.featureDetails.sort((item1: IFeatureDetails, item2: IFeatureDetails) => {
            if(item1.orderNumber < item2.orderNumber)
              return -1;
            if(item1.orderNumber > item2.orderNumber)
              return 1;
            return 0;
          });
        }
        this.kanbanBoardSpinner = false;
        this.setBoard();
      },(err)=>{
        this.kanbanBoardSpinner = false;
        this.error = err;
      });

    this.productService
      .getKanbanViewByProductIdAndQuery(this.selectedProduct.id, this.currentSprint.id, [], this.selectedGroupCategory)
      .subscribe((x) => {
        this.kanbanWithoutFilter = x;
        // this.kanbanBoardWithoutFilter = x.kanbanList;
        // for(let module of this.kanbanBoard) {
        //   module.featureDetails.sort((item1: IFeatureDetails, item2: IFeatureDetails) => {
        //     if(item1.orderNumber < item2.orderNumber)
        //       return -1;
        //     if(item1.orderNumber > item2.orderNumber)
        //       return 1;
        //     return 0;
        //   });
        // }
        for(let module of this.kanbanWithoutFilter.kanbanList) {
          module.featureDetails.sort((item1: IFeatureDetails, item2: IFeatureDetails) => {
            if(item1.orderNumber < item2.orderNumber)
              return -1;
            if(item1.orderNumber > item2.orderNumber)
              return 1;
            return 0;
          });
        }
        this.setWithoutFilterBoard();
      },(err)=>{

      });
  }

  findIndex(moduleName: string): number {
    for(let i = 0; i < this.board.length; i++) {
      if(this.board[i][0].name == moduleName) {
        return i;
      }
    }
    throw "No module found.";
  }

  geModuleDetailsByModuleName(moduleName: string): IModule | null{
    let module = null;
    for(let current of this.modules) {
      if(current.name === moduleName) {
        module = current;
        break;
      }
    }
    return module;
  }


  onDrop(event: CdkDragDrop<any[]>) {
    // let cardDroppedInModuleIndex = this.findIndex(event.container.id);
    if(event.previousIndex === event.currentIndex && event.container.id === event.previousContainer.id) {
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    let previousToCardPlacedCardId = event.currentIndex === 0 ? -1 : event.container.data[event.currentIndex-1].id;
    let placedCardId = event.container.data[event.currentIndex].id;
    let cardDroppedInModule = this.geModuleDetailsByModuleName(event.container.id);
    let doesCardDroppedInSameModule = true;

    let copyOfPlacedCard: any = null; // Getting copyOfPlacedCard can be improved
    for(let module of this.boardWithoutFilter) {
      for(let index = 0; index < module.length; index++) {
        if(module[index].id === placedCardId) {
          copyOfPlacedCard = JSON.parse(JSON.stringify(module[index]));
          if(copyOfPlacedCard.moduleId !== cardDroppedInModule?.id) {
            doesCardDroppedInSameModule = false;
            copyOfPlacedCard.moduleId = cardDroppedInModule?.id;
          }
          module.splice(index, 1);
          break;
        }
      }
    }

    for(let module of this.boardWithoutFilter) {
      if(previousToCardPlacedCardId === -1 && module.groupName === event.container.id) {
        module.splice(0, 0, copyOfPlacedCard);
        break;
      }
      for(let index = 0; index < module.length; index++) {
        if(module[index].id === previousToCardPlacedCardId) {
          module.splice(index + 1, 0, copyOfPlacedCard);
        }
      }
    }

    for(let module of this.board) {
      for(let index = 0; index < module.length; index++) {
        if(module[index].id === placedCardId) {
          module[index].moduleId = copyOfPlacedCard.moduleId;
        }
      }
    }
    let orderingInfo = this.getReordering();
    this.featureService.modifyFeatureOrder(orderingInfo).subscribe(x => {
      if(!doesCardDroppedInSameModule) {
        this.modifyFeature(ModifyColumnIdentifier.updateModule, cardDroppedInModule?.id, copyOfPlacedCard);
      }
    },err => {
      this.toastr.error('Not Updated',err.error);
    });
  }

  getReordering(): OrderingInfo {
    let counter = 0;
    let featureOrder: FeatureOrdering[] = [];
    let map = new Map<number,number>() // Store card id and order number after reordering
    for(let i = 0; i < this.boardWithoutFilter.length; i++) {
      for(let j = 0; j < this.boardWithoutFilter[i].length; j++) {
        featureOrder.push({featureId: this.boardWithoutFilter[i][j].id, orderNumber: ++counter});
        this.boardWithoutFilter[i][j].order = counter;
        map.set(this.boardWithoutFilter[i][j].id, counter);
      }
    }

    for(let i = 0; i < this.board.length; i++) {
      for(let j = 0; j < this.board[i].length; j++) {
        this.board[i][j].order = map.get(this.board[i][j].id);
      }
    }
    
    let orderingInfo: OrderingInfo = {
      sprintId: this.currentSprint?this.currentSprint.id:-1,
      featuresOrdering: featureOrder
    };

    return orderingInfo;
  }

  setWithoutFilterBoard() {
    this.boardWithoutFilter = [];
    let orderNumber = 0;
    // for(let module of this.kanbanBoardWithoutFilter) {
    //   let tempModuleContainer: any = [];
    //   tempModuleContainer.groupName = module.groupList[0].groupName;
    //   for(let feature of module.featureDetails) {
    //     let currentFeature = {
    //       id: feature.id,
    //       order: feature.orderNumber !== 0 ? feature.orderNumber : orderNumber + 1,
    //       moduleId: feature.moduleId
    //     };
    //     orderNumber++;
    //     tempModuleContainer.push(currentFeature);
    //   }
    //   this.boardWithoutFilter.push(tempModuleContainer);
    // }
    for(let module of this.kanbanWithoutFilter.kanbanList) {
        let tempModuleContainer: any = [];
        tempModuleContainer.groupName = module.groupList[0].groupName;
        for(let feature of module.featureDetails) {
          let currentFeature = {
            id: feature.id,
            order: feature.orderNumber !== 0 ? feature.orderNumber : orderNumber + 1,
            moduleId: feature.moduleId
          };
          orderNumber++;
          tempModuleContainer.push(currentFeature);
        }
        this.boardWithoutFilter.push(tempModuleContainer);
      }
    for(let i=0;i<this.boardWithoutFilter.length;i++) {
      this.boardWithoutFilter[i].sort((item1: {id: number, order: number}, item2: {id: number, order: number}) => {
        if(item1.order < item2.order) {
          return -1;
        }
        if(item2. order > item2.order) {
          return 1;
        }
        return 0;
      });
    }
  }

  setBoard() {
    this.sprintDates = [];
    if(!this.currentSprint?.startDate || !this.currentSprint?.endDate)
      return;
    var startDate: Date = new Date(this.currentSprint?.startDate);
    var endDate: Date = new Date(this.currentSprint?.endDate);
    while(startDate <= endDate) {
      this.sprintDates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    this.board = [];
    let orderNumber = 0;
    // for(let module of this.kanbanBoard) {
    //   let tempModuleContainer: any = [];
    //   tempModuleContainer.groupName = module.groupList[0].groupName;
    //   for(let feature of module.featureDetails) {
    //     let currentFeature = {
    //       id: feature.id,
    //       name: module.groupList[0].groupName,
    //       title: feature.title,
    //       storyPoint: feature.storyPoint,
    //       startDate: feature.plannedStartDate,
    //       endDate: feature.plannedEndDate,
    //       durationInDays: feature.plannedEndDate && feature.plannedStartDate ? this.getNumberOfDaysBetweenTwoDates(new Date(feature.plannedEndDate),new Date(feature.plannedStartDate)): null,
    //       assignee: feature.assignees,
    //       scrumDays: this.sortByDateAndAddExtra(feature.scrumDays),
    //       remarks: feature.remarks,
    //       functionalTestability: feature.functionalTestability,
    //       order: feature.orderNumber !== 0 ? feature.orderNumber : orderNumber + 1,
    //       workItemType: feature.workItemType,
    //       moduleId: feature.moduleId
    //     };
    //     orderNumber++;
    //     tempModuleContainer.push(currentFeature);
    //   }
    //   this.board.push(tempModuleContainer);
    // }
    for(let module of this.kanban.kanbanList) {
      let tempModuleContainer: any = [];
      tempModuleContainer.groupName = module.groupList[0].groupName;
      for(let feature of module.featureDetails) {
        let currentFeature = {
          id: feature.id,
          name: module.groupList[0].groupName,
          title: feature.title,
          storyPoint: feature.storyPoint,
          startDate: feature.plannedStartDate,
          endDate: feature.plannedEndDate,
          durationInDays: feature.plannedEndDate && feature.plannedStartDate ? this.getNumberOfDaysBetweenTwoDates(new Date(feature.plannedEndDate),new Date(feature.plannedStartDate)): null,
          assignee: feature.assignees,
          scrumDays: this.sortByDateAndAddExtra(feature.scrumDays),
          remarks: feature.remarks,
          functionalTestability: feature.functionalTestability,
          order: feature.orderNumber !== 0 ? feature.orderNumber : orderNumber + 1,
          workItemType: feature.workItemType,
          moduleId: feature.moduleId
        };
        orderNumber++;
        tempModuleContainer.push(currentFeature);
      }
      this.board.push(tempModuleContainer);
    }
  }

  modifyFeature(key: number, value: any, feature: any) {
    let changedFeaturedInfo: any = {};
    changedFeaturedInfo.id = feature.id;
    changedFeaturedInfo.fieldName = key;
    if (key == ModifyColumnIdentifier.title) {
      changedFeaturedInfo.title = value;
    } else if (key == ModifyColumnIdentifier.workCompletionPercentage) {
      changedFeaturedInfo.workCompletionPercentage = value;
    } else if (key == ModifyColumnIdentifier.acceptanceCriteria) {
      changedFeaturedInfo.acceptanceCriteria = value;
    } else if (key == ModifyColumnIdentifier.plannedStartDate) {
      changedFeaturedInfo.plannedStartDate = new Date(value.getTime() + 86400000); // 1 day error correction
      if(feature.endDate !== null)
        feature.durationInDays = this.getNumberOfDaysBetweenTwoDates(new Date(value),new Date(feature.endDate));
      this.modifyFeatureDates(feature,ModifyColumnIdentifier.plannedStartDate,new Date(value.getTime()));
    } else if (key == ModifyColumnIdentifier.plannedEndDate) {
      changedFeaturedInfo.plannedEndDate = new Date(value.getTime() + 86400000);
      this.modifyFeatureDates(feature,ModifyColumnIdentifier.plannedEndDate,new Date(value.getTime()));
      if(feature.startDate !== null)
        feature.durationInDays = this.getNumberOfDaysBetweenTwoDates(new Date(feature.startDate),new Date(value));
    } else if(key == ModifyColumnIdentifier.storyPoint){
      changedFeaturedInfo.storyPoint = +value;
    } else if(key == ModifyColumnIdentifier.includeAssignee){
      changedFeaturedInfo.emailOfAssignee = value.email;
    } else if(key == ModifyColumnIdentifier.excludeAssignee){
      changedFeaturedInfo.emailOfAssignee = value.email;
      changedFeaturedInfo.assignee = value;
    }else if(key == ModifyColumnIdentifier.remarks){
      changedFeaturedInfo.remarks = value;
    } else if(key == ModifyColumnIdentifier.functionalTestability){
      changedFeaturedInfo.functionalTestability = value.target.checked;
    } else if(key == ModifyColumnIdentifier.updateModule) {
      changedFeaturedInfo.moduleId = value;
    }
    this.featureService.modifyFeatureElement(changedFeaturedInfo).subscribe((x) => {

    },(err)=>{
      this.toastr.error(err.error,'Not Modified');
    });
  }

  modifyFeatureDates(modifiedFeature: any, dateType: ModifyColumnIdentifier, date: Date) {
    for(let feature of this.board){
      if(feature.id === modifiedFeature.id){
        if(dateType === ModifyColumnIdentifier.plannedStartDate){
          feature.startDate = date;
        }else {
          feature.endDate = date;
        }
      }
    }
  }
  
  public get modifyColumnIdentifier(): typeof ModifyColumnIdentifier {
    return ModifyColumnIdentifier;
  }

  getNumberOfDaysBetweenTwoDates(start: Date,end: Date): number {
    return Math.ceil(Math.abs((start.getTime()-end.getTime())/(1000*60*60*24))) + 1;
  }
  
  restrictGreaterThan100(prevalue: any, currkey: any){
    if(currkey < 48 || currkey > 57)
      return false;
    const currentValue = prevalue.innerText * 10 + (currkey - 48);
    return currentValue > 0 && currentValue <= 100;
  }

  public get groupCategoryEnum(): typeof GroupCategory {
    return GroupCategory;
  }
  
  ngOnDestroy(): void {
    // this.eventsSubscription.unsubscribe();
  }
}