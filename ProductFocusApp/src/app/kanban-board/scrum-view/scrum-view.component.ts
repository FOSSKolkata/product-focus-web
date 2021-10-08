import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { IKanbanBoard, IMemberDetail, IScrumDay, ISprint, ModifyColumnIdentifier, OrderingCategoryEnum } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';
import { ProductService } from 'src/app/_services/product.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-scrum-view',
  templateUrl: './scrum-view.component.html',
  styleUrls: ['./scrum-view.component.scss']
})
export class ScrumViewComponent implements OnInit, OnDestroy {
  @Input('kanban-board') kanbanBoard: IKanbanBoard[] = [];
  @Input('selected-sprint') currentSprint: ISprint | null = null;
  @Input('is-loading')kanbanBoardSpinner: boolean = false;
  @Input('selected-userids') selectedUserIds = [];
  @Input() events: Observable<void> | undefined;

  sprintDates: Date[] = [];
  board:any[] = [];
  organizationUser: IMemberDetail[] = [];
  organization: any | null = null;
  countOfFeatureInModule = new Map<string,number>();
  addFeatureModuleId = -1;
  selectedProduct!: {id: number, name: string};
  featureOrder = new Map<number,number>();
  eventsSubscription!: Subscription;
  error!: HttpErrorResponse;
  
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

  moveUp(order: number){
    for(let i=1;i<this.board.length;i++) {
      if(this.board[i].order == order) {
        let temp = this.board[i];
        this.board[i] = this.board[i-1];
        this.board[i-1] = temp;
        let tempIsFirst = this.board[i].isFirst;
        this.board[i].isFirst = this.board[i-1].isFirst;
        this.board[i-1].isFirst = tempIsFirst;
        let tempIsLast = this.board[i].isLast;
        this.board[i].isLast = this.board[i-1].isLast;
        this.board[i-1].isLast = tempIsLast;
        let tempName = this.board[i].name;
        this.board[i].name = this.board[i-1].name;
        this.board[i-1].name = tempName;
        let tempOrder = this.board[i].order;
        this.board[i].order = this.board[i-1].order;
        this.board[i-1].order = tempOrder;
      }
    }
  }

  moveDown(order: number){
    for(let i=0;i<this.board.length;i++) {
      if(this.board[i].order == order) {
        let temp = this.board[i+1]
        this.board[i+1] = this.board[i];
        this.board[i] = temp;
        let tempIsFirst = this.board[i].isFirst;
        this.board[i].isFirst = this.board[i+1].isFirst;
        this.board[i+1].isFirst = tempIsFirst;
        let tempIsLast = this.board[i].isLast;
        this.board[i].isLast = this.board[i+1].isLast;
        this.board[i+1].isLast = tempIsLast;
        let tempName = this.board[i].name;
        this.board[i].name = this.board[i+1].name;
        this.board[i+1].name = tempName;
        let tempOrder = this.board[i].order;
        this.board[i].order = this.board[i-1].order;
        this.board[i-1].order = tempOrder;
      }
    }
  }

  requireColspan(featureName: string){
    return this.countOfFeatureInModule.get(featureName);
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
    
    if(this.events) {
      this.eventsSubscription = this.events.subscribe(() => {
        setTimeout(()=> {
          this.setKanbanBoard();
        },0);
      });
    }
    
    while(!this.currentSprint) {
      await new Promise(resolve => setTimeout(resolve,100));
    }
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
      .getKanbanViewByProductIdAndQuery(this.selectedProduct.id, OrderingCategoryEnum.ScrumView, this.currentSprint.id, this.selectedUserIds)
      .subscribe((x) => {
        console.log(x);
        this.kanbanBoard = x;
        this.kanbanBoardSpinner = false;
        this.setBoard();
      },(err)=>{
        this.kanbanBoardSpinner = false;
        this.error = err;
      });
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
    this.countOfFeatureInModule.clear();
    this.board = [];
    if(this.kanbanBoard.length >= 1) {
      this.selectModuleOnAddFeature(this.kanbanBoard[0].id);
    }
    let previousIndex = 0;
    for(let module of this.kanbanBoard) {
      let counter = 0;
      for(let feature of module.featureDetails) {
        let currentFeature = {
          id: feature.id,
          name: this.countOfFeatureInModule.has(module.name)?'':module.name,
          title: feature.title,
          storyPoint: feature.storyPoint,
          startDate: feature.plannedStartDate,
          endDate: feature.plannedEndDate,
          durationInDays: feature.plannedEndDate && feature.plannedStartDate ? this.getNumberOfDaysBetweenTwoDates(new Date(feature.plannedEndDate),new Date(feature.plannedStartDate)): null,
          assignee: feature.assignees,
          scrumDays: this.sortByDateAndAddExtra(feature.scrumDays),
          remarks: feature.remarks,
          functionalTestability: feature.functionalTestability,
          isFirst: counter == 0,
          isLast: counter == module.featureDetails.length - 1,
          order: feature.OrderNumber !== 0 ? feature.OrderNumber : counter + 1
        };
        counter++;
        var curr = this.countOfFeatureInModule.get(module.name);
        if(curr === undefined)
          this.countOfFeatureInModule.set(module.name,1);
        else
          this.countOfFeatureInModule.set(module.name,curr + 1);
        this.board.push(currentFeature);
        if(currentFeature.isLast) {
          this.partialSort(this.board,previousIndex, counter - 1);
          previousIndex = counter + 1;
        }
      }
    }
  }

  modifyFeature(key: number, value: any, feature: any) {
    var changedFeaturedInfo: any = {};
    var changedFeaturedInfoEvent: any = {};
    changedFeaturedInfo.id = feature.id;
    changedFeaturedInfoEvent.id = feature.id;
    changedFeaturedInfo.fieldName = key;
    changedFeaturedInfoEvent.fieldName = key;
    if (key == ModifyColumnIdentifier.title) {
      changedFeaturedInfo.title = value;
      changedFeaturedInfoEvent.title = value;
    } else if (key == ModifyColumnIdentifier.workCompletionPercentage) {
      changedFeaturedInfo.workCompletionPercentage = value;
      changedFeaturedInfoEvent.workCompletionPercentage = value;
    } else if (key == ModifyColumnIdentifier.acceptanceCriteria) {
      changedFeaturedInfo.acceptanceCriteria = value;
      changedFeaturedInfoEvent.acceptanceCriteria = value;
    } else if (key == ModifyColumnIdentifier.plannedStartDate) {
      changedFeaturedInfo.plannedStartDate = new Date(value.getTime() + 86400000); // 1 day error correction
      changedFeaturedInfoEvent.plannedStartDate = new Date(value.getTime() + 86400000);
      if(feature.endDate !== null)
        feature.durationInDays = this.getNumberOfDaysBetweenTwoDates(new Date(value),new Date(feature.endDate));
      this.modifyFeatureDates(feature,ModifyColumnIdentifier.plannedStartDate,new Date(value.getTime()));
    } else if (key == ModifyColumnIdentifier.plannedEndDate) {
      changedFeaturedInfo.plannedEndDate = new Date(value.getTime() + 86400000);
      changedFeaturedInfoEvent.plannedEndDate = new Date(value.getTime() + 86400000);
      this.modifyFeatureDates(feature,ModifyColumnIdentifier.plannedEndDate,new Date(value.getTime()));
      if(feature.startDate !== null)
        feature.durationInDays = this.getNumberOfDaysBetweenTwoDates(new Date(feature.startDate),new Date(value));
    } else if(key == ModifyColumnIdentifier.storyPoint){
      changedFeaturedInfo.storyPoint = +value;
      changedFeaturedInfoEvent.storyPoint = +value;
    } else if(key == ModifyColumnIdentifier.includeAssignee){
      changedFeaturedInfo.emailOfAssignee = value.email;
      changedFeaturedInfoEvent.assignee = value;
    } else if(key == ModifyColumnIdentifier.excludeAssignee){
      changedFeaturedInfo.emailOfAssignee = value.email;
      changedFeaturedInfo.assignee = value;
    }else if(key == ModifyColumnIdentifier.remarks){
      changedFeaturedInfo.remarks = value,
      changedFeaturedInfoEvent.remarks = value
    } else if(key == ModifyColumnIdentifier.functionalTestability){
      changedFeaturedInfo.functionalTestability = value.target.checked;
      changedFeaturedInfoEvent.functionalTestability = value.target.value;
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

  selectModuleOnAddFeature(event: any | number) {
    if(typeof event === 'number') {
      this.addFeatureModuleId = event;
    }else {
      this.addFeatureModuleId = event.target.value;
    }
  }

  partialSort(arr: any, l: number, r: number): void {
    let size = r - l + 1;
    let temp = new Array(size);
    let tempName = new Array(size);
    let j = 0;
    for(let i=l;i<=r;i++) {
      tempName[j] = {name: arr[i].name, isFirst: arr[i].isFirst, isLast: arr[i].isLast};
      temp[j++] = arr[i];
    }
    temp.sort((a,b) => a.order - b.order);
    for(let i=0;i<size;i++) {
      arr[l+i] = temp[i];
      arr[l+i].name = tempName[i].name;
      arr[l+i].isFirst = tempName[i].isFirst;
      arr[l+i].isLast = tempName[i].isLast;
    }
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
}