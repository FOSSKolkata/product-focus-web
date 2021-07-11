import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DateFunctionService } from 'src/app/dht-common/date-function.service';
import { IKanbanBoard, IMemberDetail, ISprint, ModifyColumnIdentifier } from 'src/app/dht-common/models';
import { FeatureService } from 'src/app/_services/feature.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-scrum-view',
  templateUrl: './scrum-view.component.html',
  styleUrls: ['./scrum-view.component.scss']
})
export class ScrumViewComponent implements OnInit, OnChanges {

  @Input('kanban-board') kanbanBoard: IKanbanBoard[] = [];
  @Input('selected-sprint') currentSprint: ISprint | null = null;
  sprintDates: Date[] = [];
  board:any[] = [];
  organizationUser: IMemberDetail[] = [];
  organization: any | null = null;
  countOfFeatureInModule = new Map<string,number>();

  constructor(private datePipe: DatePipe,
    private dateService: DateFunctionService,
    private featureService: FeatureService,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Hello world",this.kanbanBoard);
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
      for(let feature of module.featureDetails){
        let currentFeature = {
          id: feature.id,
          name: this.countOfFeatureInModule.has(module.name)?'':module.name,
          title: feature.title,
          storyPoint: feature.storyPoint,
          startDate: feature.plannedStartDate,
          endDate: feature.plannedEndDate,
          durationInDays: (new Date(feature.plannedEndDate).getTime() - new Date(feature.plannedStartDate).getTime())/(1000*60*60*24),
          assignee: feature.assignees,
        };
        var curr = this.countOfFeatureInModule.get(module.name);
        if(curr === undefined)
          this.countOfFeatureInModule.set(module.name,1);
        else
          this.countOfFeatureInModule.set(module.name,curr + 1);
        this.board.push(currentFeature);
      }
    }
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
      console.log("userlist ::",this.organizationUser);
    });
  }

  addUserInFeature(event: any, feature: any){
    this.modifyFeature(ModifyColumnIdentifier.includeAssignee,event.email,feature);
  }

  modifyFeature(key: number, value: any, feature: any) {
    var object: any = {};
    object.id = feature.id;
    object.fieldName = key;
    if (key == ModifyColumnIdentifier.title) {
      object.title = value;
    } else if (key == ModifyColumnIdentifier.workCompletionPercentage) {
      object.workCompletionPercentage = value;
    } else if (key == ModifyColumnIdentifier.acceptanceCriteria) {
      object.acceptanceCriteria = value;
    } else if (key == ModifyColumnIdentifier.plannedStartDate) {
      object.plannedStartDate = new Date(value.getTime() + 86400000); // 1 day error correction
      feature.plannedStartDate = value;
    } else if (key == ModifyColumnIdentifier.plannedEndDate) {
      object.plannedEndDate = new Date(value.getTime() + 86400000);
      feature.plannedEndDate = value;
    } else if (key == ModifyColumnIdentifier.sprint) {
      object.sprintName = value.name;
    } else if(key == ModifyColumnIdentifier.storyPoint){
      object.storyPoint = value;
    } else if(key == ModifyColumnIdentifier.includeAssignee){
      object.emailOfAssignee = value;
    }
    this.featureService.modifyFeatureElement(object).subscribe((x) => {
      console.log(x);
    },(err)=>{
      this.toastr.error('Update is not saved!!','Not Modified');
    });
  }
  
  public get modifyColumnIdentifier(): typeof ModifyColumnIdentifier {
    return ModifyColumnIdentifier;
  }

}
