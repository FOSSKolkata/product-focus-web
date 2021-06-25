import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { StylingService } from '../side-nav/styling.service';
import { ProductService } from '../_services/product.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { FeatureService } from '../_services/feature.service';
import { ModifyColumnIdentifier } from './feature-details/feature-details.component';
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

@Component({
  selector: 'app-kanban-board-component',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  modules: IModule[] = [];
  kanbanBoard: IKanbanBoard[] = [];
  closeResult = '';
  moduleServiceSubscriptions: SubSink = new SubSink();
  moduleAddView: boolean = false;
  sprintAddView: boolean = false;
  moduleName: string | undefined;
  sprintName: string | undefined;
  productId!: number;
  selectedProduct!: any;
  selectedOrganization!: any;
  kanbanBoardSpinner: boolean = false;
  board: any = [];
  enabledAdding: boolean = true;
  allSprint: ISprint[] = [];
  organizationUser: IMemberDetail[] = [];
  sprintForm = new FormGroup({
    name: new FormControl(''),
    dates: new FormControl('',this.DateValidate())
  });

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    public styling: StylingService,
    private modalService: NgbModal,
    private sprintService: SprintService,
    private calendar: NgbCalendar,
    private featureService: FeatureService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private router: Router
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 14);
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
    this.setKanbanBoard();
  }

  setAssignedTo(){
    this.userService.getUserListByOrganization(this.selectedOrganization.id).subscribe(x => {
      this.organizationUser = x.members;
    });
  }

  setSprint() {
    this.sprintService.getSprintByProductId(this.productId).subscribe((x) => {
      this.allSprint = x;
    });
  }

  filterSprint(sprint: any) {
    console.log(sprint);
  }

  setKanbanBoard() {
    if (this.productId === undefined) return;
    this.kanbanBoardSpinner = true;
    this.board = [];
    this.productService
      .getKanbanViewByProductId(this.productId)
      .subscribe((x) => {
        this.kanbanBoardSpinner = false;
        this.kanbanBoard = x;
        for (var module of this.kanbanBoard) {
          this.board.push([]);
          this.board[this.board.length - 1].name = module.name;
          this.board[this.board.length - 1].id = module.id;
          for (var feature of module.featureDetails) {
            if (this.board[this.board.length - 1].length == 0) {
              for (var i = 0; i < 4; i++) {
                this.board[this.board.length - 1].push([]);
              }
            }
            this.board[this.board.length - 1][feature.status].push(feature);
          }
        }
        console.log('kanban board response', x);
        console.log('formated data', this.board);
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

  drop(event: CdkDragDrop<any[]>, status: FeatureStatus) {
    console.log(event, status);
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
    // Iterate on every features where featureElement is dropped
    for (var feature of event.container.data) {
      if (feature.status != status) {
        // Since the status of element where it is dropped is not equal to the status of that column
        feature.status = status;
        this.featureService
          .modifyFeatureElement({
            id: feature.id,
            status: status,
            fieldName: ModifyColumnIdentifier.status,
          })
          .subscribe((x) => {
            console.log(x);
          });
      }
    }
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
      startDate: this.ngbDateToDate(this.fromDate),
      endDate: this.ngbDateToDate(this.toDate),
    };
    this.sprintService.addSprint(input).subscribe(
      (x) => {
        this.toastr.success('Sprint added','Success');
        console.log(x);
        this.sprintAddView = false;
      },
      (err) => {
        this.toastr.error('Sprint not added','Failed');
      }
    );
  }

  ngbDateToDate(ngbDate: NgbDateStruct) {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day + 1);
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
        const isRangeValid = (this.ngbDateToDate(this.toDate).getTime()-this.ngbDateToDate(this.fromDate).getTime() > 0);
        return isRangeValid ? null : {dateRange:true};
      }
      return null;
    }
  }
  public get sprintname() {
    return this.sprintForm.value['name'];
  }
}

import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { UserService } from '../_services/user.service';
