import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateFunctionService } from 'src/app/dht-common/date-function.service';
import { FeatureService } from 'src/app/_services/feature.service';
import { ModuleService } from 'src/app/_services/module.service';
import { OrganizationService } from 'src/app/_services/organization.service';
import { ReleaseService } from 'src/app/_services/release.service';
import { SprintService } from 'src/app/_services/sprint.service';
import { IFeature, IFeatureDetails, IMember, IModule, IOrganization, IRelease, ISprint, ModifyColumnIdentifier, ReleaseStatusEnum, WorkItemType } from '../../dht-common/models';

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
  private organization!: IOrganization;
  private organizationName: string;
  prouctId: number;
  allSprint!: ISprint[];
  isBlocked = false;
  startDate!: NgbDateStruct;
  endDate!: NgbDateStruct;
  allStoryPoints: number[] = [];
  modules: IModule[] = [];
  selectedModule: IModule = {
    id: -1,
    name: ''
  };
  
  releases: IRelease[] = [];
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
    orderNumber: Infinity,
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
    remarks: null,
    workItemType: WorkItemType.Feature,
    moduleId: -1,
    release: {
      id: -1,
      name: '',
      releaseDate: new Date(),
      createdOn: new Date(),
      bugCount: 0,
      epicCount: 0,
      featureCount: 0,
      pbiCount: 0,
      status: ReleaseStatusEnum.NotStarted
    }
  };

  loading = true;
  isAddTaskButtonActive: boolean = true;
  businessRequirement = '';

  addBrMode = false;

  constructor(
    private featureService: FeatureService,
    private sprintService: SprintService,
    private dateService: DateFunctionService,
    private toastr: ToastrService,
    private moduleService: ModuleService,
    private releaseService: ReleaseService,
    private route: ActivatedRoute,
    private organizationService: OrganizationService
  ) {
    this.prouctId = this.route.snapshot.params['id'];
    this.organizationName = this.route.snapshot.parent?.parent?.params['organizationName'];
  }

  async ngOnInit(): Promise<void> {
    this.organization = await this.organizationService.getOrganizationByName(this.organizationName).toPromise();
    this.generateStoryPoints();
    var date = this.featureDetails.actualStartDate;

    await Promise.all([this.featureService
      .getFeatureDetailsById(this.organization.id, this.feature.id)
      .subscribe((x) => {
        this.featureDetails = x;
        this.startDate = this.dateService.dateToNgbDate(
          new Date(this.featureDetails.plannedStartDate)
        );
        this.endDate = this.dateService.dateToNgbDate(
          new Date(this.featureDetails.plannedEndDate)
        );
      }),
        
      this.moduleService.getModulesByProductId(this.prouctId).subscribe(x => {
        this.modules = x;
        this.selectModuleOfFeature();
      }),

      this.sprintService.getSprintByProductId(this.prouctId).subscribe((x) => {
        this.allSprint = x;
      }),
      this.releaseService.getReleasesByProductId(this.prouctId).subscribe(x => {
        this.releases = x;
      })
    ]);
    this.loading = false;
  }
  
  selectModuleOfFeature() {
    let currentFeatureModule = this.modules.find((x) => x.id == this.feature.moduleId);
    if(!!currentFeatureModule) {
      this.selectedModule = currentFeatureModule;
    }
  }

  moveToAnotherModule(event: any) {
    if(!event.value) {
      this.modifyFeature(ModifyColumnIdentifier.updateModule, null);
    }else {
      let changedModule = this.modules.filter(x => x.name == event.value)[0];
      this.modifyFeature(ModifyColumnIdentifier.updateModule, changedModule.id);
    }
  }

  moveFeatureToRelease(event: any) {
    if(!event.value) {
      this.modifyFeature(ModifyColumnIdentifier.Release, null);
    } else {
      this.modifyFeature(ModifyColumnIdentifier.Release, event.value);
    }
  }

  addRemoveOwners(event: IMember) {

  }
  
  modifyFeature(key: number, value: any) {
    this.anyChanges.emit(true);
    let object: any = {};
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
      object.fieldName = ModifyColumnIdentifier.includeExcludeOwners;
      object.excludeOwnerList = [];
      object.includeOwnerList = [value.id];
      this.featureDetails.assignees.push(value);
    } else if (key == ModifyColumnIdentifier.storyPoint) {
      object.storyPoint = value.target.value;
      this.featureDetails.storyPoint = value.target.value;
    } else if (key == ModifyColumnIdentifier.sprint) {
      object.sprintId = value;
    } else if(key == ModifyColumnIdentifier.excludeAssignee){
      object.fieldName = ModifyColumnIdentifier.includeExcludeOwners;
      object.excludeOwnerList = [value.id];
      object.includeOwnerList = [];
    } else if(key == ModifyColumnIdentifier.updateModule) {
      object.moduleId = value;
    } else if(key == ModifyColumnIdentifier.Release) {
      object.fieldName = ModifyColumnIdentifier.Release;
      object.releaseId = value;
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
