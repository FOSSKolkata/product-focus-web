import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateFunctionService } from 'src/app/dht-common/date-function.service';
import { FeatureService } from 'src/app/_services/feature.service';
import { SprintService } from 'src/app/_services/sprint.service';
import { IFeature, IFeatureDetails, ISprint, ModifyColumnIdentifier } from '../../dht-common/models';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.scss'],
})
export class FeatureDetailsComponent implements OnInit {
  restrictGreaterThan100(prevalue: any, currkey: any){
    if(currkey.charCode < 48 || currkey.charCode > 57)
      return false;
    const currentValue = prevalue * 10 + (currkey.charCode - 48);
    return currentValue > 0 && currentValue <= 100;
  }
  
  @Output('any-changes') anyChanges = new EventEmitter<boolean>();
  productId!: number;
  allSprint!: ISprint[];
  isBlocked = false;
  startDate!: NgbDateStruct;
  endDate!: NgbDateStruct;
  allStoryPoints: number[] = [];
  @Input() feature: IFeature = {
    id: -1,
    moduleId: -1,
    title: '',
    status: 0,
    isBlocked: false,
    workItemType: 0,
    plannedStartDate: new Date(),
    plannedEndDate: new Date(),
    actualStartDate: new Date(),
    actualEndDate: new Date(),
    assignees: [],
    storyPoint: 0,
    workCompletionPercentage: 0
  };

  featureDetails: IFeatureDetails = {
    featureOrderNumber: null,
    id: -1,
    description: '',
    isBlocked: false,
    status: 0,
    storyPoint: 0,
    OrderNumber: Infinity,
    workCompletionPercentage: 0,
    title: '',
    assignees: [],
    members: [],
    acceptanceCriteria: '',
    actualEndDate: new Date(),
    actualStartDate: new Date(),
    plannedEndDate: new Date(),
    plannedStartDate: new Date(),
    sprint: {
      id: -1,
      startDate: new Date(),
      endDate: new Date(),
      name: '',
    },
    scrumDays: [],
    functionalTestability: false,
    remarks: null
  };

  isAddTaskButtonActive: boolean = true;

  constructor(
    private featureService: FeatureService,
    private sprintService: SprintService,
    private router: Router,
    private dateService: DateFunctionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.generateStoryPoints();
    var date = this.featureDetails.actualStartDate;
    console.log(this.featureDetails.plannedStartDate);
    var lastProductId: any = localStorage.getItem('productId');
    var lastSelectedOrgId = localStorage.lastSelctedOrganizationId;
    this.productId = lastProductId;
    if (
      lastSelectedOrgId == undefined ||
      lastSelectedOrgId == null ||
      lastProductId == undefined ||
      lastProductId == null
    ) {
      this.router.navigate(['/']);
    }

    this.featureService
      .getFeatureDetailsById(parseInt(lastSelectedOrgId), this.feature.id)
      .subscribe((x) => {
        this.featureDetails = x;
        this.startDate = this.dateService.dateToNgbDate(
          new Date(this.featureDetails.plannedStartDate)
        );
        this.endDate = this.dateService.dateToNgbDate(
          new Date(this.featureDetails.plannedEndDate)
        );
      });

    this.sprintService.getSprintByProductId(this.productId).subscribe((x) => {

      this.allSprint = x;
    });
  }
  
  modifyFeature(key: number, value: any) {
    this.anyChanges.emit(true);
    var object: any = {};
    object.id = this.feature.id;
    object.fieldName = key;
    if (key == ModifyColumnIdentifier.title) {
      object.title = value;
    } else if (key == ModifyColumnIdentifier.description) {
      object.description = value;
    } else if (key == ModifyColumnIdentifier.workCompletionPercentage) {
      object.workCompletionPercentage = value;
    } else if (key == ModifyColumnIdentifier.acceptanceCriteria) {
      object.acceptanceCriteria = value;
    } else if (key == ModifyColumnIdentifier.plannedStartDate) {
      object.plannedStartDate = this.dateService.ngbDateToDate(value);
    } else if (key == ModifyColumnIdentifier.plannedEndDate) {
      object.plannedEndDate = this.dateService.ngbDateToDate(value);
    } else if (key == ModifyColumnIdentifier.isBlocked) {
      object.isBlocked = value;
      this.featureDetails.isBlocked = value; // do not need to call api again
    } else if (key == ModifyColumnIdentifier.includeAssignee) {
      object.emailOfAssignee = value.email;
      this.featureDetails.assignees.push(value);
    } else if (key == ModifyColumnIdentifier.storyPoint) {
      object.storyPoint = value.target.value;
      this.featureDetails.storyPoint = value.target.value;
    } else if (key == ModifyColumnIdentifier.sprint) {
      object.sprintName = value.name;
    } else if(key == ModifyColumnIdentifier.excludeAssignee){
      object.emailOfAssignee = value.email;
    }
    this.featureService.modifyFeatureElement(object).subscribe((x) => {

    },(err)=>{
      this.toastr.error('Update is not saved!!','Not modified')
    });
  }

  public get modifyColumnIdentifier(): typeof ModifyColumnIdentifier {
    return ModifyColumnIdentifier;
  }

  generateStoryPoints() {
    for (var i = 1; i < 100; i++) {
      this.allStoryPoints.push(i);
    }
  }
}
