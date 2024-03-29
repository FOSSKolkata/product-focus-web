import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SprintService } from '../_services/sprint.service';
import { FeatureStatus, GroupCategory, IKanbanBoard, IMemberDetail, IModule, IOrganization, ISprint } from '../dht-common/models';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services/user.service';
import { Subject } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { BoardViewComponent } from './board-view/board-view.component';
import { ScrumViewComponent } from './scrum-view/scrum-view.component';
import { OrganizationService } from '../_services/organization.service';
import { finalize } from 'rxjs/operators';
import { ModuleService } from '../_services/module.service';

@Component({
  selector: 'app-kanban-board-component',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  modules: IModule[] = [];
  eventsSubject: Subject<void> = new Subject<void>();
  subject = new Subject<number>();
  kanbanBoardWithoutFilter: IKanbanBoard[] = [];
  moduleAddView: boolean = false;
  sprintAddView: boolean = false;
  moduleName: string | undefined;
  productId!: number;
  selectedOrganization!: IOrganization;
  enabledAdding: boolean = true;
  allSprint: ISprint[] = [];
  organizationUser: IMemberDetail[] = [];
  isKanbanMode:boolean;
  isFocusMode: boolean = false;
  currentSprint: ISprint | null = null;
  selectedSprint = this.currentSprint;
  selectedUserIds = [];
  initializingAddSprintModal!: NgbModalRef;
  sprintExist = true;
  kanbanBoardSpinner = true;
  selectedGroup = GroupCategory.Module;
  selectedSprintForUpdate?: ISprint | null = null;
  deletingId: number | null = null;
  @ViewChild(BoardViewComponent, { static: false }) boardViewViewChild: BoardViewComponent | undefined;
  @ViewChild(ScrumViewComponent, {static: false }) scrumViewViewChild: ScrumViewComponent | undefined;
  @ViewChild('manageSprintContent1', {static: true}) manageSprintContent1!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private sprintService: SprintService,
    private toastr: ToastrService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private moduleService: ModuleService
  ) {
    this.isKanbanMode = localStorage.isKanbanMode === undefined?true:localStorage.isKanbanMode == "true"?true: false;
  }

  async ngOnInit(): Promise<void> {
    this.productId = this.activatedRoute.snapshot.params.id;
    let organizationName = this.activatedRoute.snapshot.parent?.parent?.params['organizationName'];
    this.selectedOrganization = await this.organizationService.getOrganizationByName(organizationName).toPromise();
    await this.doesSprintExistSetIt();
    if(!this.sprintExist){
      this.kanbanBoardSpinner = false;
      let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false,
        size: 'lg'
      };
      this.initializingAddSprintModal = this.modalService.open(this.manageSprintContent1, ngbModalOptions);
    }
    this.setModules();
    this.setAssignedTo();
  }

  setAssignedTo(): void {
    this.userService.getUserListByOrganization(this.selectedOrganization.id).subscribe(x => {
      this.organizationUser = x.members;
    });
  }

  async doesSprintExistSetIt(): Promise<boolean> {
    await this.sprintService.getSprintByProductId(this.productId).toPromise().then(x => {
      if(x.length == 0)
        this.sprintExist = false;
      else{
        this.selectedSprint = x[0];
        this.sprintExist = true;
      }
      this.allSprint = x;
    });
    if(!this.sprintExist){
      return false;
    }
    
    this.currentSprint = this.allSprint[0];
    this.selectSprint(this.currentSprint);
    this.emitEventToChild();
    return true;
  }

  selectSprint(sprint: ISprint): void {
    this.currentSprint = sprint;
    this.selectedSprint = JSON.parse(JSON.stringify(this.currentSprint));
  }

  setModules(): void {
    if (this.productId === undefined) return;
    this.moduleService.getModulesByProductId(this.productId).subscribe((x) => {
      this.modules = x;
    });
  }

  addModule(): void {
    if (this.productId == undefined || this.moduleName == undefined) return;
    this.enabledAdding = false;
    this.moduleService.addModule(this.productId, this.moduleName).subscribe(
      (x) => {
        this.toastr.success('Module added','Success');
        this.moduleName = '';
        this.moduleAddView = false;
        this.enabledAdding = true;
        this.setModules();
        this.reloadChildComponents();
      },
      (err) => {
        this.enabledAdding = true;
        this.toastr.error('Module not added','Failed');
      }
    );
  }

  deleteSprint(sprint: ISprint) {
    this.deletingId = sprint.id;
    this.sprintService.deleteSprint(sprint.id).pipe(
      finalize(() => {
        this.deletingId = null;
      })
    ).subscribe(x => {
      this.toastr.success('Sprint deleted', 'Success');
      this.doesSprintExistSetIt();
    }, err => {
      this.toastr.error(err.error, 'Failed');
    })
  }

  selectSprintForUpdate(sprint: ISprint) {
    this.selectedSprintForUpdate = sprint;
  }

  openPopup(content: any, size: string = 'md'): void {
    this.modalService
      .open(content, { ariaLabelledBy: 'generic modal', size: size })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  reloadChildComponents(): void {
    setTimeout(()=> {
      this.boardViewViewChild?.setKanbanBoard();
      this.scrumViewViewChild?.setKanbanBoard();
    });
  }

  async doesSprintAdded(added: boolean): Promise<void> {
    if(added) {
      this.doesSprintExistSetIt();
      this.modalService.dismissAll();
    }
  }

  public get featureStatus(): typeof FeatureStatus {
    return FeatureStatus;
  }
  
  public groupCategory(): Array<string> {
    const keys = Object.keys(GroupCategory);
    return keys.slice(keys.length / 2);
  }

  groupCategoryChange(event: MatSelectChange) {
    this.selectedGroup = event.value;
    this.reloadChildComponents();
  }
  

  changeMode(isKanbanMode: boolean){
    this.isKanbanMode = isKanbanMode;
    localStorage.isKanbanMode = isKanbanMode;
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }
  
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

}