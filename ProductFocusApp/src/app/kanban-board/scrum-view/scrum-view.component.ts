import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IFeatureInput, IKanbanBoard, IMemberDetail, IScrumDay, ISprint, ModifyColumnIdentifier } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';
import { ModuleService } from 'src/app/_services/module.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-scrum-view',
  templateUrl: './scrum-view.component.html',
  styleUrls: ['./scrum-view.component.scss']
})
export class ScrumViewComponent implements OnInit, OnChanges {

  @Input('kanban-board') kanbanBoard: IKanbanBoard[] = [];
  @Input('selected-sprint') currentSprint: ISprint | null = null;
  @Output('changed') changes = new EventEmitter<any>();
  @Input('is-loading')kanbanBoardSpinner: boolean = false;
  @Output('row-added') rowAdded = new EventEmitter<boolean>();

  sprintDates: Date[] = [];
  board:any[] = [];
  organizationUser: IMemberDetail[] = [];
  organization: any | null = null;
  countOfFeatureInModule = new Map<string,number>();

  constructor(private featureService: FeatureService,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private moduleService: ModuleService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.sprintDates = [];
    if(!this.currentSprint?.startDate || !this.currentSprint?.endDate)
      return;
    var startDate: Date = new Date(this.currentSprint?.startDate);
    var endDate: Date = new Date(this.currentSprint?.endDate);
    while(startDate <= endDate){
      this.sprintDates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    this.countOfFeatureInModule.clear();
    this.board = [];
    for(let module of this.kanbanBoard){
      var counter = 0;
      for(let feature of module.featureDetails){
        let currentFeature = {
          create: false,
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
          isLast: counter == module.featureDetails.length - 1
        };
        counter++;
        var curr = this.countOfFeatureInModule.get(module.name);
        if(curr === undefined)
          this.countOfFeatureInModule.set(module.name,2);
        else
          this.countOfFeatureInModule.set(module.name,curr + 1);
        this.board.push(currentFeature);
      }
      let createBugFeature = {
        moduleId: module.id,
        create: true,
        moduleName: module.name,
        size: module.featureDetails.length
      }
      this.board.push(createBugFeature);
    }
  }
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

  requireColspan(featureName: string){
    return this.countOfFeatureInModule.get(featureName);
  }

  ngOnInit(): void {
    this.organization = JSON.parse(localStorage.selectedOrganization);
    if(this.organization === undefined || this.organization === null){
      this.router.navigate(['/']);
    }
    this.userService.getUserListByOrganization(this.organization.id).subscribe(x=>{
      this.organizationUser = x.members;
    });
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
      this.fireChanges(changedFeaturedInfoEvent);
    },(err)=>{
      this.toastr.error('Update is not saved!!','Not Modified');
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
  fireChanges(modifiedFeature: any) {
    this.changes.emit(modifiedFeature);
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

  addRow(workItemType: string, moduleId: number, titleEvent: any):void{
    var featureInput: IFeatureInput = {
      title: titleEvent.value,
      workItemType: workItemType,
      sprintId: this.currentSprint?.id || -1
    };
    this.moduleService.addFeatureInModule(moduleId, featureInput).subscribe(x => {
      titleEvent.value = '';
      this.rowAdded.emit(true);
      this.toastr.success('Feature added','success');
    },err=>{
      this.toastr.error(err.error,'Failed');
    });
  }

}