import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SprintService } from '../_services/sprint.service';
import { FeatureStatus, IKanbanBoard, IMemberDetail, IModule, ISprint, ISprintInput } from '../dht-common/models';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { DateFunctionService } from '../dht-common/date-function.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-kanban-board-component',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  modules: IModule[] = [];
  eventsSubject: Subject<void> = new Subject<void>();
  subject = new Subject<number>();
  kanbanBoardWithoutFilter: IKanbanBoard[] = [];
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
  isFocusMode: boolean = false;
  currentSprint: ISprint | null = null;
  selectedSprint = this.currentSprint;
  selectedUserIds = [];
  sprintForm = new FormGroup({
    name: new FormControl(''),
    dates: new FormControl('',this.DateValidate())
  });
  sprintExist = true;
  isSprintAdding = false;
  isDisabled = (date: NgbDate, current?: {year: number, month: number}) => this.isSprintAdding;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private sprintService: SprintService,
    private calendar: NgbCalendar,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private dateService: DateFunctionService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 14);
    this.isKanbanMode = localStorage.isKanbanMode === undefined?true:localStorage.isKanbanMode == "true"?true: false;
  }

  async ngOnInit(): Promise<void> {
    this.productId = this.activatedRoute.snapshot.params.id;
    if(localStorage.selectedOrganization === undefined || localStorage.selectedProduct === undefined)
      this.router.navigate(['/']);
    this.selectedProduct = JSON.parse(localStorage.selectedProduct);
    this.selectedOrganization = JSON.parse(localStorage.selectedOrganization);
    this.breadcrumbService.set('@kanbanboard', {
      label: this.selectedProduct.name,
      routeInterceptor: (routeLink, breadcrumb) =>
        this.selectedProduct.name
    });
    await this.doesSprintExistSetIt();
    if(!this.sprintExist){
      return;
    }
    this.setModules();
    this.setAssignedTo();
  }

  setAssignedTo(){
    this.userService.getUserListByOrganization(this.selectedOrganization.id).subscribe(x => {
      this.organizationUser = x.members;
    });
  }

  async doesSprintExistSetIt(): Promise<boolean> {
    await this.sprintService.getSprintByProductId(this.productId).toPromise().then(x => {
      if(x.length == 0)
        this.sprintExist = false;
      this.allSprint = x;
    });
    if(!this.sprintExist){
      return false;
    }
    
    this.currentSprint = this.allSprint[0];
    this.selectSprint(this.currentSprint);
    return true;
  }

  selectSprint(sprint: ISprint) {
    this.currentSprint = sprint;
    this.selectedSprint = JSON.parse(JSON.stringify(this.currentSprint));
  }

  setModules() {
    if (this.productId === undefined) return;
    this.productService.getModulesByProductId(this.productId).subscribe((x) => {
      this.modules = x;
    });
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
        if(this.sprintExist) {
          this.setModules();
        }
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

  onDateSelection(date: NgbDate) {
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
    }
    var input: ISprintInput = {
      productId: +this.productId,
      name: this.sprintName,
      startDate: this.dateService.ngbDateToDate(this.fromDate),
      endDate: this.dateService.ngbDateToDate(this.toDate),
    };
    this.isSprintAdding = true;
    this.sprintService.addSprint(input).subscribe(
      (x) => {
        this.sprintName = '';
        this.toastr.success('Sprint added','Success');
        this.isSprintAdding = false;
        this.doesSprintExistSetIt();
      },
      (err) => {
        this.sprintName = '';
        this.toastr.error(err.error,'Failed');
        this.isSprintAdding = false;
      }
    );
  }

  public get featureStatus(): typeof FeatureStatus {
    return FeatureStatus;
  }
  
  DateValidate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
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

  public get sprintValidate(){
    return this.sprintForm;
  }

  changeMode(isKanbanMode: boolean){
    this.isKanbanMode = isKanbanMode;
    localStorage.isKanbanMode = isKanbanMode;
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }
}