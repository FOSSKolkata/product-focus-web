import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ProductService } from '../_services/product.service';
import {
  NgbCalendar,
  NgbDate,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { SprintService } from '../_services/sprint.service';
import {
  FeatureStatus,
  IKanbanBoard,
  IMemberDetail,
  IModule,
  ISprint,
  ISprintInput,
} from '../dht-common/models';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'angular-crumbs';
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { DateFunctionService } from '../dht-common/date-function.service';
import { ModifyColumnIdentifier } from '../dht-common/models';

@Component({
  selector: 'app-kanban-board-component',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  modules: IModule[] = [];
  kanbanBoard: IKanbanBoard[] = [];
  moduleServiceSubscriptions: SubSink = new SubSink();
  moduleAddView: boolean = false;
  sprintAddView: boolean = false;
  moduleName: string | undefined;
  sprintName: string = "";
  productId!: number;
  selectedProduct!: any;
  selectedOrganization!: any;
  enabledAdding: boolean = true;
  allSprint: ISprint[] = [];
  organizationUser: IMemberDetail[] = [];
  isKanbanMode:boolean;
  isLoading = false;
  currentSprint: ISprint = {
    id: -1,
    name: '',
    startDate: new Date(),
    endDate: new Date()
  }
  selectedSprint = this.currentSprint;
  selectedUserIds = [];
  sprintForm = new FormGroup({
    name: new FormControl(''),
    dates: new FormControl('',this.DateValidate())
  });

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private sprintService: SprintService,
    private calendar: NgbCalendar,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private router: Router,
    private dateService: DateFunctionService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 14);
    this.isKanbanMode = localStorage.isKanbanMode === undefined?true:localStorage.isKanbanMode == "true"?true: false;
  }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params.id;
    if(localStorage.selectedOrganization === undefined || localStorage.selectedProduct === undefined)
      this.router.navigate(['/']);
    this.selectedProduct = JSON.parse(localStorage.selectedProduct);
    this.selectedOrganization = JSON.parse(localStorage.selectedOrganization);

    this.breadcrumbService.changeBreadcrumb(this.route.snapshot,this.selectedProduct.name);
    this.setModules();
    this.setSprint();
    this.setAssignedTo();
  }

  setAssignedTo(){
    this.userService.getUserListByOrganization(this.selectedOrganization.id).subscribe(x => {
      this.organizationUser = x.members;
    });
  }

  setSprint() {
    this.sprintService.getSprintByProductId(this.productId).subscribe((x) => {
      this.allSprint = x;
      this.currentSprint = this.allSprint[0];
      this.selectSprint(this.currentSprint);
    });
  }

  selectSprint(sprint: ISprint) {
    this.currentSprint = sprint;
    this.selectedSprint = JSON.parse(JSON.stringify(this.currentSprint));
    this.setKanbanBoard();
  }

  setKanbanBoard() {
    if (this.productId === undefined) return;
    this.isLoading = true;
    this.productService
      .getKanbanViewByProductIdAndQuery(this.productId,this.currentSprint.id,this.selectedUserIds)
      .subscribe((x) => {
        this.kanbanBoard = x;
        this.isLoading = false;
      });
  }

  setModules() {
    if (this.productId === undefined) return;
    this.productService.getModulesByProductId(this.productId).subscribe((x) => {
      this.modules = x;
    });
  }

  ngOnDestroy(): void {
    this.moduleServiceSubscriptions.unsubscribe();
  }

  addModule() {
    if (this.productId == undefined || this.moduleName == undefined) return;
    this.enabledAdding = false;
    this.productService.addModule(this.productId, this.moduleName).subscribe(
      (x) => {
        this.toastr.success('Module added','Success');
        this.moduleName = '';
        this.moduleAddView = false;
        this.enabledAdding = true;
        this.setModules();
        this.setKanbanBoard();
      },
      (err) => {
        this.enabledAdding = true;
        this.toastr.error('Module not added','Failed');
      }
    );
  }

  openPopup(content: any, size: string = 'md') {
    this.modalService
      .open(content, { ariaLabelledBy: 'generic modal', size: size })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  isFocusMode: boolean = false;
  onDateSelection(date: NgbDate) {
    // console.log(date);
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.sprintForm = new FormGroup({
      name: new FormControl(this.sprintForm.value['name']),
      dates: new FormControl('',this.DateValidate())
    });
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  addSprint() {
    if (this.toDate == null || this.fromDate == null) {
      alert('Please select proper date');
      return;
    } else if (
      this.sprintName == undefined ||
      this.sprintName.trim().length == 0
    ) {
      alert('Sprint name cannot be empty');
      return;
    }
    var input: ISprintInput = {
      productId: this.productId,
      name: this.sprintName,
      startDate: this.dateService.ngbDateToDate(this.fromDate),
      endDate: this.dateService.ngbDateToDate(this.toDate),
    };
    this.sprintService.addSprint(input).subscribe(
      (x) => {
        this.toastr.success('Sprint added','Success');
        console.log(x);
        this.setSprint();
        this.sprintAddView = false;
      },
      (err) => {
        this.toastr.error('Sprint not added','Failed');
      }
    );
  }


  public get featureStatus(): typeof FeatureStatus {
    return FeatureStatus;
  }
  DateValidate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(control,this.fromDate,this.toDate);
      if(this.toDate == null)
        return {dateNotChosen: true};
      if (this.fromDate && this.toDate) {
        const isRangeValid = (this.dateService.ngbDateToDate(this.toDate).getTime()-this.dateService.ngbDateToDate(this.fromDate).getTime() > 0);
        return isRangeValid ? null : {dateRange:true};
      }
      return null;
    }
  }
  public get sprintname() {
    return this.sprintForm.value['name'];
  }

  changeMode(isKanbanMode: boolean){
    this.isKanbanMode = isKanbanMode;
    localStorage.isKanbanMode = isKanbanMode;
  }

  updateChanges(modifiedFeatureInfo: any){ // Id, fieldName(enum value), fieldname
    for(let module of this.kanbanBoard){
      for(let feature of module.featureDetails){
        if(feature.id === modifiedFeatureInfo.id){
          if(modifiedFeatureInfo.fieldName === ModifyColumnIdentifier.storyPoint){
            feature.storyPoint = modifiedFeatureInfo.storyPoint;
          }else if(modifiedFeatureInfo.fieldName === ModifyColumnIdentifier.includeAssignee){
            feature.assignees.push(modifiedFeatureInfo.assignee);
          }else if(modifiedFeatureInfo.fieldName === ModifyColumnIdentifier.actualStartDate){
            feature.actualStartDate = modifiedFeatureInfo.plannedStartDate;
          }else if(modifiedFeatureInfo.fieldName === ModifyColumnIdentifier.actualEndDate){
            feature.actualEndDate = modifiedFeatureInfo.plannedEndDate;
          }else if(modifiedFeatureInfo.fieldName === ModifyColumnIdentifier.description){
            feature.description = modifiedFeatureInfo.description;
          }else if(modifiedFeatureInfo.fieldName === ModifyColumnIdentifier.title){
            feature.title = modifiedFeatureInfo.title;
          }else if(modifiedFeatureInfo.fieldName === ModifyColumnIdentifier.workCompletionPercentage){
            feature.workCompletionPercentage = modifiedFeatureInfo.workCompletionPercentage
          }
        }
      }
    }
  }
}